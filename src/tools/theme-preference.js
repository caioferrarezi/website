export function getThemePreference() {
  let theme = localStorage.getItem('theme')

  if (!theme) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    if (typeof mql.matches === 'boolean')
      theme = mql.matches ? 'dark' : 'light'
  }

  return theme || 'light'
}

export function setThemePreference(value) {
  localStorage.setItem('theme', value)

  document.body.classList.remove('light')
  document.body.classList.remove('dark')

  document.body.classList.add(value)

  return value
}

export const setInitialTheme = `(function() {
  ${getThemePreference.toString()}

  document.body.style.transition = 'none'
  document.body.classList.add(getThemePreference())
})()`
