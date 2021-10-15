import React, { useState, useContext, useEffect } from 'react'
import { ReactSVG } from 'react-svg'
import switchLight from '../assets/img/theme-switch-light.svg'
import switchDark from '../assets/img/theme-switch-dark.svg'
import { ThemeContext } from './Theme'

export default function ThemeSelector() {
  const { theme, userThemeChange } = useContext(ThemeContext)
  const [current, setCurrent] = useState(theme === 'light' ? true : false)

  const handleTheme = () => {
    userThemeChange(current)
    setCurrent(!current)
  }
  useEffect(() => {
    setCurrent(theme === 'light' ? true : false)
  }, [theme])

  return (
    <div className="theme-setting">
      <button onClick={() => handleTheme()}>
        <ReactSVG src={current ? switchLight : switchDark} />
      </button>
    </div>
  )
}
