import { useEffect, useState } from 'react'

import styles from './theme-switcher.module.css'

function getLocalTheme() {
  let theme = 'light'

  if (typeof localStorage !== 'undefined') {
    theme = localStorage.getItem('theme')
  }

  return theme
}

function setLocalTheme(value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', value)
  }

  if (typeof window !== 'undefined') {
    document.body.classList.remove('light')
    document.body.classList.remove('dark')

    document.body.classList.add(value)
  }
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(getLocalTheme())

  const changeTheme = ({ target }) => {
    const { value } = target

    setTheme(value)
    setLocalTheme(value)
  }

  useEffect(() => {
    document.body.style.transition = null
  }, [])

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
