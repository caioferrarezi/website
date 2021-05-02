import theme from '../lib/theme'

import 'normalize.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  theme.update()

  return <Component {...pageProps} />
}

export default MyApp
