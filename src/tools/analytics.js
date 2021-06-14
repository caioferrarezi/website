const analyticsKey = process.env.VERCEL_ENV === 'production'
  ? 'G-5TCB42MKSW' : 'G-DKJ0G7MEX0'

export const setAnalytics = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${analyticsKey}');
`
