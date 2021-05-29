import Document, { Html, Head, Main, NextScript } from 'next/document'

import { getThemePreference } from '../src/tools/theme-preference'

const setInitialTheme = `(function() {
  ${getThemePreference.toString()}

  document.body.style.transition = 'none'
  document.body.classList.add(getThemePreference())
})()`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head />
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
