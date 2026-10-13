import { useAuth } from '../../auth/useAuth'

export default function SessionControls() {
  const { signOut, isPending } = useAuth()
  return <div className="mx-auto flex w-full max-w-content justify-end px-space-md py-space-xs">
    <button className="min-h-control rounded-button px-space-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      disabled={isPending} onClick={() => { void signOut().catch(() => {}) }} type="button">Sign out</button>
  </div>
}
