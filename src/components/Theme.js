import React, { createContext, useState } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
})

export function GridThemeProvider({ children }) {
  const defaultTheme = window.localStorage.getItem('theme')
  const [theme, setUserTheme] = useState(defaultTheme || 'light')

  const provider = {
    theme,
    userThemeChange: (selected) => {
      const newTheme = !selected ? 'light' : 'dark'
      setUserTheme(newTheme)
      window.localStorage.setItem('theme', newTheme)
    },
  }

  return (
    <ThemeContext.Provider value={provider}>{children}</ThemeContext.Provider>
  )
}
