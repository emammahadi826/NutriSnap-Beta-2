
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"
import { useTheme as useNextTheme } from "next-themes"

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Re-export useTheme to be used in other components
const useTheme = useNextTheme;

export { ThemeProvider, useTheme }
