import Document, { Html, Head, Main, NextScript } from 'next/document'

import { setInitialTheme } from '../src/tools/theme-preference'
import { setAnalytics } from '../src/tools/analytics'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-5TCB42MKSW"></script>
          <script
            dangerouslySetInnerHTML={{ __html: setAnalytics }}
          ></script>
        </Head>

        <body>
          <script
            dangerouslySetInnerHTML={{ __html: setInitialTheme }}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
