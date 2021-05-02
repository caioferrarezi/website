(function () {
  if (typeof localStorage !== 'undefined') {
    document.body.style.transition = 'none'
    document.body.classList.add(localStorage.getItem('theme') || 'light')
  }
})()
