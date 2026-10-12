/**
 * @file src/App.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P8 — Purchase Check + Result + Explicit Confirmation
 * @createdAt 2026-09-15T20:49:59+10:00
 * @updatedAt 2026-09-16T01:39:12+10:00
 * @summary Owns shared runway source state and the explicit purchase-confirmation transition.
 * @responsibility Owns application state, typed callbacks, source-state mutation, and route composition.
 */

import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { INITIAL_RUNWAY_STATE, type RunwayStatePatch } from './types/runway'
import LoginPage from './pages/LoginPage'
import ProtectEssentialsPage from './pages/ProtectEssentialsPage'
import PurchaseCheckPage from './pages/PurchaseCheckPage'
import ResultPage from './pages/ResultPage'
import RunwayResultPage from './pages/RunwayResultPage'
import RunwaySetupPage from './pages/RunwaySetupPage'
import { parseValidMoney, formatMoneyInputValue } from './utils/moneyValidation'
import { calculateRunway } from './utils/runwayCalculations'

function App() {
  const [runwayState, setRunwayState] = useState(INITIAL_RUNWAY_STATE)

  function handleRunwayStateChange(patch: RunwayStatePatch) {
    setRunwayState((currentState) => ({ ...currentState, ...patch }))
  }

  function handleStartNewPurchase() {
    setRunwayState((currentState) => ({
      ...currentState,
      purchaseName: '',
      purchaseAmount: '',
      purchaseConfirmed: false,
    }))
  }

  function handlePurchaseConfirmation() {
    setRunwayState((currentState) => {
      if (currentState.purchaseConfirmed) {
        return currentState
      }

      const availableFunds = parseValidMoney(currentState.availableFunds)
      const fixedEssentials = parseValidMoney(currentState.fixedEssentials)
      const flexibleEssentials = parseValidMoney(currentState.flexibleEssentials)
      const safetyBuffer = parseValidMoney(currentState.safetyBuffer)
      const purchaseAmount = parseValidMoney(currentState.purchaseAmount)

      if (
        availableFunds === undefined ||
        fixedEssentials === undefined ||
        flexibleEssentials === undefined ||
        safetyBuffer === undefined ||
        purchaseAmount === undefined ||
        purchaseAmount <= 0
      ) {
        return currentState
      }

      const currentRunway = calculateRunway(
        availableFunds,
        fixedEssentials,
        flexibleEssentials,
        safetyBuffer,
      )

      if (purchaseAmount > currentRunway) {
        return currentState
      }

      // Only this explicit callback mutates recorded funds; preview navigation never reaches this path.
      return {
        ...currentState,
        availableFunds: formatMoneyInputValue(availableFunds - purchaseAmount),
        purchaseConfirmed: true,
      }
    })
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route
        path="/login"
        element={<LoginPage onStartSession={() => handleRunwayStateChange(INITIAL_RUNWAY_STATE)} />}
      />
      <Route
        path="/setup"
        element={
          <RunwaySetupPage
            onRunwayStateChange={handleRunwayStateChange}
            runwayState={runwayState}
          />
        }
      />
      <Route
        path="/essentials"
        element={
          <ProtectEssentialsPage
            onRunwayStateChange={handleRunwayStateChange}
            runwayState={runwayState}
          />
        }
      />
      <Route
        path="/runway"
        element={<RunwayResultPage onStartNewPurchase={handleStartNewPurchase} runwayState={runwayState} />}
      />
      <Route
        path="/purchase"
        element={
          <PurchaseCheckPage
            onRunwayStateChange={handleRunwayStateChange}
            onStartNewPurchase={handleStartNewPurchase}
            runwayState={runwayState}
          />
        }
      />
      <Route
        path="/result"
        element={
          <ResultPage
            onConfirmPurchase={handlePurchaseConfirmation}
            onStartNewPurchase={handleStartNewPurchase}
            runwayState={runwayState}
          />
        }
      />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}

export default App
