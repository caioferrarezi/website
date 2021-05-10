import Link from 'next/link'

import dynamic from 'next/dynamic'
import styles from './header.module.css'

const ThemeSwitcher = dynamic(() => import('../components/theme-switcher'), { ssr: false })

export default function Header(props) {
  const { layout, avatarUrl } = props

  function getStyle(layout) {
    if (layout === 'full') {
      return `${styles.header} ${styles.headerFull}`
    }

    return styles.header
  }

  return (
    <header className={getStyle(layout)}>
      {layout === 'full' && (
        <div className={styles.headerAvatar}>
          <img
            src={avatarUrl}
            className={styles.headerAvatarImage}
            alt="Minha foto de perfil que vai do topo da cabeça até a altura do ombro, estou com cabelo e barba curtos, vestindo um óculos e uma blusa de moletom azul"
          />
        </div>
      )}

      <Link href="/">
        <a className={styles.headerLink}>
          <h1 className={styles.headerTitle}>
            Caio Ferrarezi
          </h1>
        </a>
      </Link>

      <ThemeSwitcher />
    </header>
  )
}
