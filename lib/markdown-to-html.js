import remark from 'remark'
import html from 'remark-html'
import highlight from 'remark-highlight.js'
import externalLinks from 'remark-external-links'

export default async function markdownToHtml(content) {
  const result = await remark()
    .use(highlight, { include: ['javascript', 'html'] })
    .use(externalLinks, { target: '_blank', rel: ['noreferrer'] })
    .use(html)
    .process(content)

  return result.toString()
}
