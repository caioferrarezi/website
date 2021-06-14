import Document, { Html, Head, Main, NextScript } from 'next/document'

import { getThemePreference } from '../src/tools/theme-preference'

const setInitialTheme = `(function() {
  ${getThemePreference.toString()}

  document.body.style.transition = 'none'
  document.body.classList.add(getThemePreference())
})()`

const analyticsScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5TCB42MKSW');
`

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
            dangerouslySetInnerHTML={{ __html: analyticsScript }}
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
