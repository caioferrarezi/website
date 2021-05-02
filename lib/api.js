import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), '_posts')

function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug) {
  const filePath = path.join(postsDirectory, `${slug}.md`)
  const file = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(file)

  return {
    slug,
    ...data,
    content
  }
}

export function getAllPosts() {
  const slugs = getPostSlugs()

  return slugs
    .map(slug => getPostBySlug(slug.replace('.md', '')))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}
