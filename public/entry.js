(function () {
  if (typeof localStorage !== 'undefined') {
    document.body.classList.add(localStorage.getItem('theme') || 'light')
  }
})()
