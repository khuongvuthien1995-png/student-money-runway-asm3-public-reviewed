import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthFailure } from './auth/authAdapter'
import { appHarness, baseline, afterPurchase, deferred, failure, json, planWith, testSession } from './tests/appTestHarness'

const plans = '/api/plans/current'
const purchases = `${plans}/purchases`
function fill(label: string | RegExp, value: string) { fireEvent.change(screen.getByLabelText(label), { target: { value } }) }
async function route(path: string) { await waitFor(() => expect(screen.getByTestId('route')).toHaveTextContent(path)) }
async function setupPlan() {
  fill(/Money available/, '950'); fill(/Planning date/, '2026-10-12'); fill(/Emergency reserve/, '100')
  fireEvent.click(screen.getByRole('button', { name: 'Continue to essentials' })); await route('/essentials')
  fill(/^Fixed essentials/, '455'); fill(/^Flexible essentials/, '180')
}
async function purchase(amount = '160', name = 'Test Purchase') {
  fireEvent.click(screen.getByRole('button', { name: 'Check a purchase' })); await route('/purchase')
  fill(/Purchase name/, name); fill(/Purchase amount/, amount)
  fireEvent.click(screen.getByRole('button', { name: 'Preview impact' })); await route('/result')
}
function clickConfirm() { fireEvent.click(screen.getByRole('button', { name: /Mark as spent/ })) }
async function recorded() { await screen.findByRole('heading', { name: 'Purchase recorded' }) }
function summary(label: string, expected: string) {
  const row = screen.getByText(label).parentElement
  expect(row).not.toBeNull()
  expect(within(row!).getByText(expected)).toBeInTheDocument()
}

describe('six-screen application with offline Auth and HTTP doubles', () => {
  it('redirects unauthenticated protected access to login without requesting financial data', async () => {
    const app = appHarness({ initial: null, route: '/result' }); app.mount()
    await route('/login'); expect(app.fetchMock).not.toHaveBeenCalled()
  })
  it('holds protected data during Auth bootstrap and initial plan loading', async () => {
    const app = appHarness({ route: '/runway' }); const session = deferred<ReturnType<typeof testSession>>()
    const load = deferred<Response>()
    app.auth.getSession.mockReturnValueOnce(session.promise); app.enqueue('GET', plans, () => load.promise); app.mount()
    expect(screen.getByRole('status')).toHaveTextContent('Restoring')
    expect(screen.queryByText('AUD 215')).not.toBeInTheDocument()
    await act(async () => session.resolve(testSession()))
    expect(screen.getByRole('status')).toHaveTextContent('Loading your saved plan')
    expect(screen.queryByRole('heading', { name: 'Set up your runway' })).not.toBeInTheDocument()
    await act(async () => load.resolve(json({ plan: baseline })))
    await screen.findByRole('heading', { name: 'Your discretionary runway' })
  })
  it('waits for actual Auth adapter success before navigating after login', async () => {
    const app = appHarness({ initial: null }); const pending = deferred<ReturnType<typeof testSession>>()
    app.auth.signIn.mockReturnValueOnce(pending.promise); app.mount(); await route('/login')
    fill('Email', 'student@example.invalid'); fill('Password', 'test-only-password')
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('button', { name: /Please wait/ })).toBeDisabled()
    expect(app.fetchMock).not.toHaveBeenCalled()
    // Fake identity is published by the test adapter; production uses the SDK event.
    await act(async () => { app.emit(testSession()); pending.resolve(testSession()) })
    await route('/runway'); expect(app.auth.signIn).toHaveBeenCalledWith('student@example.invalid', 'test-only-password')
  })
  it('renders invalid credentials feedback and never starts a financial session', async () => {
    const app = appHarness({ initial: null }); app.auth.signIn.mockRejectedValueOnce(new AuthFailure('invalid_credentials')); app.mount()
    await route('/login'); fill('Email', 'student@example.invalid'); fill('Password', 'test-only-password')
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('email or password')
    expect(app.fetchMock).not.toHaveBeenCalled(); await route('/login')
  })
  it('shows signup email confirmation without fabricating a logged-in session', async () => {
    const app = appHarness({ initial: null }); app.mount(); await route('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }))
    fill('Email', 'student@example.invalid'); fill('Password', 'test-only-password')
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByRole('status')).toHaveTextContent('confirm your account')
    await route('/login'); expect(app.fetchMock).not.toHaveBeenCalled()
  })
  it('restores an existing plan, redirects login to runway and displays canonical persisted values', async () => {
    const app = appHarness(); app.mount(); await route('/runway')
    summary('Available funds', 'AUD 950'); summary('Protected total', 'AUD 735')
    expect(screen.getAllByText('AUD 215')).toHaveLength(2)
    const headers = new Headers(app.fetchMock.mock.calls[0][1]?.headers)
    expect(headers.get('Authorization')).toBe(`Bearer ${testSession().access_token}`)
  })
  it('recognizes only true PLAN_NOT_FOUND as a new plan and keeps Setup navigation write-free', async () => {
    const app = appHarness(); app.enqueue('GET', plans, failure(404, 'PLAN_NOT_FOUND')); app.mount(); await route('/setup')
    expect(screen.getByLabelText(/Money available/)).toHaveValue('')
    await setupPlan(); expect(app.requests('PUT')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Back to setup' })); await route('/setup')
    expect(screen.getByLabelText(/Money available/)).toHaveValue('950')
  })
  it.each([[0, 'NETWORK'], [503, 'SERVICE_UNAVAILABLE'], [404, 'OTHER_NOT_FOUND']] as const)('load error %s is never mistaken for an empty plan', async (status, code) => {
    const app = appHarness(); app.enqueue('GET', plans, status ? failure(status, code) : () => Promise.reject(new TypeError('offline'))); app.mount()
    await screen.findByRole('button', { name: 'Retry loading plan' })
    expect(screen.queryByRole('heading', { name: 'Set up your runway' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry loading plan' })); await route('/runway')
  })
  it('saves exact cents once, disables pending submission and uses returned data', async () => {
    const app = appHarness(); app.enqueue('GET', plans, failure(404, 'PLAN_NOT_FOUND'))
    const saved = deferred<Response>(); app.enqueue('PUT', plans, () => saved.promise); app.mount(); await route('/setup'); await setupPlan()
    fireEvent.click(screen.getByRole('button', { name: 'Calculate my runway' }))
    expect(screen.getByRole('button', { name: /Saving plan/ })).toBeDisabled()
    fireEvent.submit(screen.getByLabelText(/^Fixed essentials/).closest('form')!)
    await waitFor(() => expect(app.requests('PUT')).toHaveLength(1))
    expect(JSON.parse(String(app.requests('PUT')[0][1]?.body))).toEqual({ planningDate: '2026-10-12', availableFundsCents: 95000,
      safetyBufferCents: 10000, fixedEssentialsCents: 45500, flexibleEssentialsCents: 18000 })
    await route('/essentials')
    await act(async () => saved.resolve(json({ plan: { ...baseline, availableFundsCents: 96000, runwayCents: 22500 } })))
    await route('/runway'); summary('Available funds', 'AUD 960')
  })
  it.each([422, 503])('preserves unsaved fields after failed save %s and allows retry', async (status) => {
    const app = appHarness({ route: '/essentials' }); app.enqueue('PUT', plans, failure(status, 'INVALID_REQUEST')); app.mount(); await screen.findByLabelText(/^Fixed essentials/)
    fill(/^Fixed essentials/, '450.01'); fireEvent.click(screen.getByRole('button', { name: 'Calculate my runway' }))
    await screen.findByRole('alert'); await route('/essentials'); expect(screen.getByLabelText(/^Fixed essentials/)).toHaveValue('450.01')
    expect(screen.getByRole('button', { name: 'Calculate my runway' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Calculate my runway' })); await route('/runway')
    summary('Fixed essentials', 'AUD 450.01')
  })
  it('hydrates edit fields and unsaved edits do not change the authoritative dashboard', async () => {
    const app = appHarness({ route: '/setup' }); app.mount(); await screen.findByLabelText(/Money available/)
    expect(screen.getByLabelText(/Money available/)).toHaveValue('950.00'); expect(screen.getByLabelText(/Emergency reserve/)).toHaveValue('100.00')
    fill(/Money available/, '999'); fireEvent.click(screen.getByRole('button', { name: 'Back to runway' })); await route('/runway')
    summary('Available funds', 'AUD 950'); expect(app.requests('PUT')).toHaveLength(0)
  })
  it.each(['-1', '1.999', '1,000', '1e3', '1000000.01'])('rejects invalid or over-limit draft money %s without mutation', async (amount) => {
    const app = appHarness({ route: '/setup' }); app.mount(); await screen.findByLabelText(/Money available/)
    fill(/Money available/, amount); fireEvent.click(screen.getByRole('button', { name: 'Continue to essentials' }))
    await route('/setup'); expect(screen.getByRole('alert')).toHaveTextContent(/Enter/); expect(app.requests('PUT')).toHaveLength(0)
  })
  it('previews canonical purchase with no POST, confirms once and views updated runway', async () => {
    const app = appHarness(); app.mount(); await route('/runway'); await purchase()
    summary('Runway before', 'AUD 215'); summary('Remaining runway', 'AUD 55'); expect(app.requests('POST')).toHaveLength(0)
    clickConfirm(); await recorded(); expect(app.requests('POST')).toHaveLength(1)
    summary('Updated discretionary runway', 'AUD 55')
    fireEvent.click(screen.getByRole('button', { name: 'View updated runway' })); await route('/runway'); summary('Available funds', 'AUD 790')
    fireEvent.click(screen.getByRole('button', { name: 'Test direct result' })); await recorded(); expect(app.requests('POST')).toHaveLength(1)
  })
  it('uses the server-returned balance rather than a local deduction', async () => {
    const app = appHarness(); app.enqueue('POST', purchases, json({ ...afterConfirmation(), plan: { ...afterPurchase, availableFundsCents: 80000, runwayCents: 6500 } })); app.mount()
    await route('/runway'); await purchase(); clickConfirm(); await recorded(); summary('Updated discretionary runway', 'AUD 65')
  })
  it('prevents double confirmation and freezes navigation while a POST is in flight', async () => {
    const app = appHarness(); const pending = deferred<Response>(); app.enqueue('POST', purchases, () => pending.promise); app.mount()
    await route('/runway'); await purchase(); const button = screen.getByRole('button', { name: /Mark as spent/ })
    fireEvent.click(button); fireEvent.click(button)
    expect(button).toBeDisabled(); expect(button).toHaveAttribute('aria-busy', 'true'); expect(screen.getByRole('button', { name: 'Back without saving' })).toBeDisabled()
    await waitFor(() => expect(app.requests('POST')).toHaveLength(1))
    await act(async () => pending.resolve(json(afterConfirmation(), 201))); await recorded()
  })
  it('keeps uncertain payload/key immutable across navigation and retries identical request', async () => {
    const app = appHarness(); app.enqueue('POST', purchases, () => Promise.reject(new TypeError('offline')))
    app.enqueue('POST', purchases, json({ ...afterConfirmation(), replayed: true })); app.mount(); await route('/runway'); await purchase()
    clickConfirm(); await screen.findByRole('button', { name: 'Retry same confirmation' })
    expect(screen.getByRole('button', { name: 'Back without saving' })).toBeDisabled()
    fireEvent.click(screen.getAllByRole('link', { name: 'Check' })[0]); await route('/result')
    fireEvent.click(screen.getAllByRole('link', { name: 'Edit plan' })[0]); await route('/result')
    fireEvent.click(screen.getByRole('button', { name: 'Retry same confirmation' })); await recorded()
    const requests = app.requests('POST'); expect(requests).toHaveLength(2)
    expect(requests[0][1]?.body).toEqual(requests[1][1]?.body)
    expect(screen.getByRole('status')).toHaveTextContent('No second deduction')
  })
  it('mints a new key for an explicit new purchase after success', async () => {
    const app = appHarness(); app.mount(); await route('/runway'); await purchase(); clickConfirm(); await recorded()
    fireEvent.click(screen.getByRole('button', { name: 'Check another purchase' })); await route('/purchase')
    fill(/Purchase name/, 'Second item'); fill(/Purchase amount/, '1'); fireEvent.click(screen.getByRole('button', { name: 'Preview impact' })); await route('/result')
    clickConfirm(); await recorded(); const requests = app.requests('POST')
    expect(JSON.parse(String(requests[0][1]?.body)).idempotencyKey).not.toEqual(JSON.parse(String(requests[1][1]?.body)).idempotencyKey)
  })
  it('retains the same payload after an actual API-client timeout and ignores its late response', async () => {
    const app = appHarness({ timeoutMs: 30 }); const late = deferred<Response>()
    app.enqueue('POST', purchases, () => late.promise); app.enqueue('POST', purchases, json({ ...afterConfirmation(), replayed: true }))
    app.mount(); await route('/runway'); await purchase(); clickConfirm()
    await screen.findByRole('button', { name: 'Retry same confirmation' })
    expect(screen.queryByRole('heading', { name: 'Purchase recorded' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry same confirmation' })); await recorded()
    expect(app.requests('POST')[0][1]?.body).toBe(app.requests('POST')[1][1]?.body)
    await act(async () => late.resolve(json(afterConfirmation())))
    expect(app.requests('POST')).toHaveLength(2)
  })
  it('refreshes authoritative amounts after an uncertain purchase without inventing confirmation success', async () => {
    const app = appHarness(); app.enqueue('GET', plans, json({ plan: baseline })); app.enqueue('GET', plans, json({ plan: afterPurchase }))
    app.enqueue('POST', purchases, () => Promise.reject(new TypeError('offline'))); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    await screen.findByRole('button', { name: 'Retry same confirmation' })
    fireEvent.click(screen.getByRole('button', { name: 'Refresh saved plan' }))
    await waitFor(() => summary('Runway before', 'AUD 55'))
    expect(screen.queryByRole('heading', { name: 'Purchase recorded' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry same confirmation' })).toBeEnabled()
    expect(app.requests('POST')).toHaveLength(1)
  })
  it('invalid purchase names or zero amounts never create a preview or POST', async () => {
    const app = appHarness({ route: '/purchase' }); app.mount(); await screen.findByLabelText(/Purchase name/)
    fill(/Purchase name/, 'x'.repeat(121)); fill(/Purchase amount/, '0')
    fireEvent.click(screen.getByRole('button', { name: 'Preview impact' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2); await route('/purchase'); expect(app.requests('POST')).toHaveLength(0)
  })
  it('retains a ready proposal key across back/preview with unchanged payload', async () => {
    const app = appHarness(); app.mount(); await route('/runway'); await purchase()
    fireEvent.click(screen.getByRole('button', { name: 'Back without saving' })); await route('/purchase')
    fireEvent.click(screen.getByRole('button', { name: 'Preview impact' })); await route('/result'); clickConfirm(); await recorded()
    expect(app.requests('POST')).toHaveLength(1)
  })
  it('rejects an excessive preview and allows exact-runway purchase', async () => {
    const app = appHarness(); app.mount(); await route('/runway'); await purchase('300')
    expect(screen.queryByRole('button', { name: /Mark as spent/ })).not.toBeInTheDocument(); summary('Amount above runway', 'AUD 85')
    fireEvent.click(screen.getByRole('button', { name: 'Edit purchase' })); await route('/purchase'); fill(/Purchase amount/, '215')
    fireEvent.click(screen.getByRole('button', { name: 'Preview impact' })); await route('/result'); clickConfirm(); await recorded()
    summary('Updated discretionary runway', 'AUD 0')
  })
  it('reconciles a stale runway rejection without showing success and permits safe editing', async () => {
    const app = appHarness(); app.enqueue('GET', plans, json({ plan: baseline })); app.enqueue('GET', plans, json({ plan: afterPurchase }))
    app.enqueue('POST', purchases, failure(409, 'PURCHASE_EXCEEDS_RUNWAY')); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    expect(await screen.findByRole('alert')).toHaveTextContent('too low'); await waitFor(() => summary('Runway before', 'AUD 55'))
    expect(screen.queryByRole('heading', { name: 'Purchase recorded' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Edit purchase' })); await route('/purchase'); expect(screen.getByLabelText(/Purchase amount/)).toHaveValue('160')
  })
  it('blocks changed-payload replay conflict without generating another key', async () => {
    const app = appHarness(); app.enqueue('POST', purchases, failure(409, 'IDEMPOTENCY_KEY_REUSED')); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    expect(await screen.findByRole('alert')).toHaveTextContent('earlier purchase')
    expect(screen.getByRole('button', { name: /Mark as spent/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Back without saving' })).toBeDisabled(); expect(app.requests('POST')).toHaveLength(1)
  })
  it('handles a genuine missing plan at confirmation by clearing saved data and returning to setup', async () => {
    const app = appHarness(); app.enqueue('POST', purchases, failure(404, 'PLAN_NOT_FOUND')); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    await route('/setup'); expect(screen.getByLabelText(/Money available/)).toHaveValue('')
    expect(screen.queryByText('Test Purchase')).not.toBeInTheDocument()
  })
  it('sums protected draft amounts at integer-cent precision', async () => {
    const app = appHarness({ route: '/essentials' }); app.mount(); await screen.findByLabelText(/^Fixed essentials/)
    fill(/^Fixed essentials/, '0.10'); fill(/^Flexible essentials/, '0.20')
    summary('Protected total', 'AUD 100.3')
    expect(screen.queryByText('AUD 100.30000000000001')).not.toBeInTheDocument()
  })
  it.each([422, 503])('shows confirmation failure %s without a false success', async (status) => {
    const app = appHarness(); app.enqueue('POST', purchases, failure(status, 'INVALID_REQUEST')); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    await screen.findByRole('alert'); expect(screen.queryByRole('heading', { name: 'Purchase recorded' })).not.toBeInTheDocument()
    if (status === 503) expect(screen.getByRole('button', { name: 'Retry same confirmation' })).toBeEnabled()
    else expect(screen.getByRole('button', { name: /Mark as spent/ })).toBeEnabled()
  })
  it.each(['GET', 'PUT', 'POST'])('expires the session on financial %s 401 and removes private state', async (method) => {
    const app = appHarness({ route: method === 'PUT' ? '/essentials' : '/login' }); app.enqueue(method, method === 'POST' ? purchases : plans, failure(401, 'UNAUTHENTICATED')); app.mount()
    if (method === 'PUT') { await screen.findByLabelText(/^Fixed essentials/); fireEvent.click(screen.getByRole('button', { name: 'Calculate my runway' })) }
    if (method === 'POST') { await route('/runway'); await purchase(); clickConfirm() }
    await route('/login'); expect(await screen.findByRole('alert')).toHaveTextContent('session expired')
    expect(screen.queryByText('AUD 950')).not.toBeInTheDocument(); expect(app.auth.signOut).toHaveBeenCalledTimes(1)
  })
  it('clears drafts, confirmed proposals and history immediately on logout', async () => {
    const app = appHarness(); const pending = deferred<void>(); app.auth.signOut.mockReturnValueOnce(pending.promise); app.mount()
    await route('/runway'); await purchase(); fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); await route('/login')
    expect(screen.queryByText('Test Purchase')).not.toBeInTheDocument(); expect(screen.queryByText('AUD 215')).not.toBeInTheDocument()
    await act(async () => { app.emit(null); pending.resolve() })
    fill('Email', 'student@example.invalid'); fill('Password', 'test-only-password')
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await route('/runway'); fireEvent.click(screen.getByRole('button', { name: 'Test direct result' })); await route('/purchase')
    expect(screen.getByLabelText(/Purchase name/)).toHaveValue('')
  })
  it('prevents a late initial GET from contaminating a different user', async () => {
    const app = appHarness({ route: '/runway' }); const slow = deferred<Response>(); app.enqueue('GET', plans, () => slow.promise); app.mount()
    await screen.findByText('Loading your saved plan…')
    app.enqueue('GET', plans, json({ plan: { ...baseline, userId: '22222222-2222-4222-8222-222222222222', availableFundsCents: 100000, runwayCents: 26500 } }))
    await act(async () => app.emit(testSession('22222222-2222-4222-8222-222222222222')))
    await waitFor(() => summary('Available funds', 'AUD 1,000'))
    await act(async () => slow.resolve(json({ plan: baseline })))
    summary('Available funds', 'AUD 1,000'); expect(screen.queryByText('AUD 950')).not.toBeInTheDocument()
  })
  it('prevents a late confirmation from appearing in a different account', async () => {
    const app = appHarness(); const slow = deferred<Response>(); app.enqueue('POST', purchases, () => slow.promise); app.mount(); await route('/runway'); await purchase(); clickConfirm()
    await waitFor(() => expect(app.requests('POST')).toHaveLength(1))
    await act(async () => app.emit(testSession('22222222-2222-4222-8222-222222222222')))
    await route('/purchase'); await act(async () => slow.resolve(json(afterConfirmation())))
    expect(screen.queryByRole('heading', { name: 'Purchase recorded' })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Purchase name/)).toHaveValue('')
  })
  it.each(['/result', '/unknown'])('handles direct invalid navigation %s without confirmation', async (path) => {
    const app = appHarness({ route: path }); app.mount(); await route(path === '/result' ? '/purchase' : '/runway')
    expect(app.requests('POST')).toHaveLength(0)
  })
  it('shows canonical shortfall with zero discretionary runway', async () => {
    const app = appHarness(); app.enqueue('GET', plans, json({ plan: planWith({ ...baseline, availableFundsCents: 65000, fixedEssentialsCents: 45400 }) })); app.mount(); await route('/runway')
    expect(screen.getByRole('alert')).toHaveTextContent('AUD 84'); expect(screen.getAllByText('AUD 0')).toHaveLength(2)
  })
  it('loads real-module history, displays failures and permits retry', async () => {
    const app = appHarness(); app.enqueue('GET', purchases, failure(503, 'SERVICE_UNAVAILABLE'))
    app.enqueue('GET', purchases, json({ purchases: [afterConfirmation().purchase] })); app.mount(); await route('/runway')
    fireEvent.click(screen.getByRole('button', { name: 'Load purchase history' })); await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Load purchase history' })); await screen.findByText('Test Purchase')
    expect(app.requests('POST')).toHaveLength(0)
  })
})

function afterConfirmation() {
  return { plan: afterPurchase, purchase: { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: baseline.id, userId: baseline.userId,
    name: 'Test Purchase', amountCents: 16000, createdAt: baseline.createdAt }, replayed: false }
}
