import remark from 'remark'
import html from 'remark-html'
import highlight from 'remark-highlight.js'

export default async function markdownToHtml(content) {
  const result = await remark()
    .use(highlight, { include: ['javascript'] })
    .use(html)
    .process(content)

  return result.toString()
}
