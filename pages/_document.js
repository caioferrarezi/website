import { parseCookies } from 'nookies'

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const cookies = parseCookies(ctx)
    const theme = cookies.theme || 'light'

    const initialProps = await Document.getInitialProps(ctx)

    return {
      theme,
      ...initialProps
    }
  }

  render() {
    const { theme } = this.props

    return (
      <Html lang="pt-br">
        <Head />
        <body className={theme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
