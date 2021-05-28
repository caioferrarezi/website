import { useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

import styles from './theme-switcher.module.css'

function getLocalTheme() {
  const cookies = parseCookies()

  return cookies.theme
}

function setLocalTheme(value) {
  setCookie(null, 'theme', value)

  document.body.classList.remove('light')
  document.body.classList.remove('dark')

  document.body.classList.add(value)

  return value
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(getLocalTheme())

  const changeTheme = ({ target }) => {
    const { value } = target

    setTheme(setLocalTheme(value))
  }

  return (
    <label
      className={styles.switcher}
      aria-label={'modo' + theme === 'dark' ? 'claro' : 'escuro'}
    >
      <input
        className={styles.switcherInput}
        type="checkbox"
        value={theme === 'dark' ? 'light' : 'dark'}
        checked={theme === 'dark'}
        onChange={changeTheme}
      />

      <span className={styles.switcherControl} />
    </label>
  )
}
