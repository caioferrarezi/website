import { useState } from 'react'

import theme from '../lib/theme'

import styles from './theme-switcher.module.css'

export default function ThemeSwitcher() {
  const [layout, setLayout] = useState(theme.state)

  function setTheme(event) {
    theme.toggle()

    setLayout(theme.state)
  }

  return (
    <label
      className={styles.switcher}
      aria-label={'modo' + layout === 'dark' ? 'claro' : 'escuro'}
    >
      <input
        className={styles.switcherInput}
        type="checkbox"
        value={layout}
        checked={layout === 'dark'}
        onChange={setTheme}
      />

      <span className={styles.switcherControl} />
    </label>
  )
}
