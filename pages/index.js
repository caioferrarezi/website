import Link from 'next/link'
import Head from 'next/head'
import Header from '../src/components/header'

import styles from './index.module.css'
import utils from '../src/styles/utils.module.css'

import { getAllPosts } from '../lib/api'
import formatDate from '../lib/format-date'

export default function Home(props) {
  const { posts, url } = props

  return (
    <div className={utils.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={url} />
        <title>Blog Pessoal | Caio Ferrarezi</title>
        <meta name="description" content="Latino-americano, desenvolvedor front-end, estudante de tecnologia, curioso e inquieto." />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Blog Pessoal | Caio Ferrarezi" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content="Latino-americano, desenvolvedor front-end, estudante de tecnologia, curioso e inquieto." />
      </Head>

      <Header layout="full" />

      <main>
        <aside className={styles.bio}>
          <p>Oi, eu sou o Caio! 🧑‍🚀 Desenvolvedor front-end e estudante de tecnologia. Aqui eu compartilho o que estou aprendendo! Se quiser, você pode me encontrar no <a href="https://www.linkedin.com/in/caio-ferrarezi-414164b3/" target="_blank" rel="noreferrer">linkedin</a> e no <a href="https://github.com/caioferrarezi" target="_blank" rel="noreferrer">github</a>.</p>
        </aside>

        <h2>Posts</h2>

        <ul className={styles.posts}>
          {posts.map(post => (
            <li key={post.slug} className={styles.postItem}>
              <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                <a>
                  <h3 className={styles.postItemTitle}>{post.title}</h3>
                </a>
              </Link>

              <div className={styles.postItemDate}>
                <time dateTime={post.date}>
                  🧑‍💻 {formatDate(post.date)}
                </time>
              </div>

              <p className={styles.postItemExcerpt}>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const url = process.env.CANONICAL_URL

  return {
    props: { posts, url }
  }
}
