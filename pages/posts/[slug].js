import Link from 'next/link'
import Head from 'next/head'
import Header from "../../src/components/header"

import utils from '../../styles/utils.module.css'
import styles from './post.module.css'

import { getPostBySlug, getPostSlugs } from "../../lib/api"
import markdownToHtml from '../../lib/markdown-to-html'
import formatDate from '../../lib/format-date'

export default function Post({ post, url }) {
  const { title, excerpt, content, date } = post

  return (
    <div className={utils.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={url} />
        <title>{title} | Caio Ferrarezi</title>
        <meta name="description" content={excerpt} />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content={`${title} | Caio Ferrarezi`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={excerpt} />
      </Head>

      <Header />

      <main>
        <h1 className={styles.postTitle}>{title}</h1>

        <div className={styles.postDate}>
          <time dateTime={date}>
            🧑‍💻 {formatDate(date)}
          </time>
        </div>

        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </main>

      <footer>
        <Link href="/">
          <a>
            👈 voltar
          </a>
        </Link>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const { slug } = context.params

  const { CANONICAL_URL } = process.env
  const url = `${CANONICAL_URL}/posts/${slug}`

  const post = getPostBySlug(slug)
  const content = await markdownToHtml(post.content)

  return {
    props: {
      post: {
        ...post,
        content
      },
      url
    }
  }
}

export async function getStaticPaths() {
  const slugs = getPostSlugs(5)

  return {
    paths: slugs.map(slug => ({
      params: { slug: slug.replace('.md', '') }
    })),
    fallback: 'blocking'
  }
}
