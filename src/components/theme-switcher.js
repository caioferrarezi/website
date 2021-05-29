import { useState } from 'react'

import styles from './theme-switcher.module.css'

import { getThemePreference, setThemePreference } from '../tools/theme-preference'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(getThemePreference())

  const changeTheme = ({ target }) => {
    const { value } = target

    setTheme(setThemePreference(value))
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
