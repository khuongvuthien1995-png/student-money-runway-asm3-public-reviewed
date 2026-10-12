/**
 * @file src/main.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P4 — Router + Page Skeletons
 * @createdAt 2026-09-15T20:49:59+10:00
 * @updatedAt 2026-09-15T23:24:27+10:00
 * @summary Mounts the application and provides the single root BrowserRouter.
 * @responsibility Owns application-root mounting and router ownership.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
