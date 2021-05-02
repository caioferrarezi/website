import Link from 'next/link'
import Head from 'next/head'
import Header from "../../components/header"

import utils from '../../styles/utils.module.css'
import styles from './post.module.css'

import { getPostBySlug, getPostSlugs } from "../../lib/api"
import markdownToHtml from '../../lib/markdown-to-html'
import formatDate from '../../lib/format-date'

export async function getStaticProps(context) {
  const { params } = context

  const post = getPostBySlug(params.slug)
  const content = await markdownToHtml(post.content)

  return {
    props: {
      post: {
        ...post,
        content
      }
    },
    revalidate: 3600
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

export default function Post({ post }) {
  const { title, excerpt, content, date } = post

  return (
    <div className={utils.container}>
      <Head>
        <title>{title} | Caio Ferrarezi</title>
        <meta name="description" content={excerpt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <h1 className={styles.postTitle}>{title}</h1>

        <div className={styles.postDate}>
          <time dateTime={post.date}>
            🧑‍💻 {formatDate(post.date)}
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
