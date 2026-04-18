import React, { createContext, useContext, useState, useEffect } from 'react'
import { THEMES, FONTS } from '../theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Design locked: Golden Hour palette + Editorial typography
  const [themeKey] = useState('warm')
  const [fontKey] = useState('editorial')

  const theme = THEMES[themeKey] || THEMES.warm
  const font = FONTS[fontKey] || FONTS.editorial

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--bg', theme.bg)
    r.style.setProperty('--bg-alt', theme.bgAlt)
    r.style.setProperty('--ink', theme.ink)
    r.style.setProperty('--ink-soft', theme.inkSoft)
    r.style.setProperty('--ink-faint', theme.inkFaint)
    r.style.setProperty('--accent', theme.accent)
    r.style.setProperty('--accent-2', theme.accent2)
    r.style.setProperty('--cream', theme.cream)
    r.style.setProperty('--line', theme.line)
    r.style.setProperty('--display', font.display)
    r.style.setProperty('--body', font.body)
    r.style.setProperty('--mono', font.mono)
    document.body.style.background = theme.bg
    document.body.style.color = theme.ink
  }, [theme, font])

  return (
    <ThemeContext.Provider value={{ theme, font, themeKey, setThemeKey, fontKey, setFontKey, THEMES, FONTS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
