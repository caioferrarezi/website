import { useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'

import styles from './index.module.css'
import utils from '../styles/utils.module.css'

import theme from '../lib/theme'
import { getAllPosts } from '../lib/api'

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: { posts }
  }
}

export default function Home(props) {
  const { posts } = props

  const [layout, setLayout] = useState(theme.state)

  function setTheme() {
    theme.toggle()

    setLayout(theme.state)
  }

  return (
    <div className={utils.container}>
      <Head>
        <title>Blog do Caio</title>
        <meta name="description" content="Latino-americano, desenvolvedor front-end, estudante de tecnologia, curioso e inquieto." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>🧑‍🚀 Blog do Caio</h1>

          <button
            type="button"
            className={utils.button}
            onClick={setTheme}
          >
            modo { layout === 'dark' ? 'claro' : 'escuro' }
          </button>
        </div>

        <p>Aqui eu compartilho o que estou aprendendo! Se quiser, você pode me encontrar no <a href="https://www.linkedin.com/in/caio-ferrarezi-414164b3/" target="_blank">linkedin</a> e no <a href="https://github.com/caioferrarezi" target="_blank">github</a>.</p>
      </header>

      <ul className={styles.posts}>
        {posts.map(post => (
          <li key={post.slug} className={styles.postItem}>
            <a href={`/posts/${post.slug}`}>
              <h2>{post.title}</h2>
            </a>

            <div className={styles.postItemDate}>
              <time dateTime={post.date}>
               🧑‍💻 {new Date(post.date.replace('-', '/'))
                    .toLocaleDateString('pt-BR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
              </time>
            </div>

            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
