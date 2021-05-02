import theme from '../lib/theme'

import 'normalize.css'
import '../styles/globals.css'

theme.update()

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
