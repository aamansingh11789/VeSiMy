// @ts-nocheck
'use client'
import type React from 'react'
import { createContext, useContext } from 'react'

// Slate theme is now the single permanent theme — no toggle needed.
const Ctx = createContext({ theme: 'slate' })
export const useTheme = () => useContext(Ctx)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ theme: 'slate' }}>{children}</Ctx.Provider>
}

// Empty stub so any existing ThemeToggle import doesn't crash
export function ThemeToggle({ size }: { size?: number }) {
  return null
}
