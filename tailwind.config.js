/**
 * @file tailwind.config.js
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P1 — Design System Foundation
 * @createdAt 2026-09-15T20:52:22+10:00
 * @updatedAt 2026-09-15T21:59:29+10:00
 * @summary Defines the central Tailwind v3 design tokens and responsive foundations.
 * @responsibility Owns the project's Tailwind theme configuration.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          pressed: '#004AC6',
        },
        background: '#F7F9FB',
        surface: '#FFFFFF',
        'on-surface': '#191C1E',
        muted: '#505F76',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        money: ['2.5rem', { lineHeight: '1', fontWeight: '600' }],
        hero: ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label-caps': [
          '0.75rem',
          { lineHeight: '1.333', fontWeight: '600', letterSpacing: '0.05em' },
        ],
      },
      spacing: {
        'space-xs': '0.5rem',
        'space-sm': '1rem',
        'space-md': '1.5rem',
        'space-lg': '2rem',
        'space-xl': '3rem',
      },
      borderRadius: {
        control: '0.25rem',
        button: '0.5rem',
        card: '0.75rem',
        pill: '9999px',
      },
      maxWidth: {
        content: '80rem',
      },
      minHeight: {
        control: '3rem',
      },
    },
  },
  plugins: [],
}
