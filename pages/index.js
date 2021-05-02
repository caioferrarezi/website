import Head from 'next/head'

import Header from '../components/header'

import styles from './index.module.css'
import utils from '../styles/utils.module.css'

import { getAllPosts } from '../lib/api'
import formatDate from '../lib/format-date'

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: { posts }
  }
}

export default function Home(props) {
  const { posts } = props

  return (
    <div className={utils.container}>
      <Head>
        <title>Blog do Caio</title>
        <meta name="description" content="Latino-americano, desenvolvedor front-end, estudante de tecnologia, curioso e inquieto." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header layout="full" />

      <main>
        <aside>
          <p>Oi, eu sou o Caio! 🧑‍🚀 Desenvolvedor front-end e estudante de tecnologia. Aqui eu compartilho o que estou aprendendo! Se quiser, você pode me encontrar no <a href="https://www.linkedin.com/in/caio-ferrarezi-414164b3/" target="_blank">linkedin</a> e no <a href="https://github.com/caioferrarezi" target="_blank">github</a>.</p>
        </aside>

        <ul className={styles.posts}>
          {posts.map(post => (
            <li key={post.slug} className={styles.postItem}>
              <a href={`/posts/${encodeURIComponent(post.slug)}`}>
                <h2>{post.title}</h2>
              </a>

              <div className={styles.postItemDate}>
                <time dateTime={post.date}>
                  🧑‍💻 {formatDate(post.date)}
                </time>
              </div>

              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
