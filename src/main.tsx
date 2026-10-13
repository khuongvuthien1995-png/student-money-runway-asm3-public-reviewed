/**
 * @file src/main.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P4 — Router + Page Skeletons
 * @createdAt 2026-09-15T20:49:59+10:00
 * @updatedAt 2026-09-15T23:24:27+10:00
 * @summary Mounts the application and provides the single root BrowserRouter.
 * @responsibility Owns application-root mounting and router ownership.
 * @integration ASM3 C1 mounts real Auth infrastructure; screen-level wiring remains C2.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
