import 'normalize.css'
import '../src/styles/globals.css'
import '../src/styles/atom-one-dark.css'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined')
      document.body.style.transition = null
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
