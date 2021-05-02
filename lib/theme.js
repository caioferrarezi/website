class Theme {
  get state() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
  }

  is(theme) {
    return this.theme === theme
  }

  toggle() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.state === 'light' ? 'dark' : 'light')
    }

    this.update()
  }

  update() {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('light')
      document.body.classList.remove('dark')
      document.body.classList.add(this.state)
    }
  }
}

const theme = new Theme()

export default theme
