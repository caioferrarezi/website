const months = [
  'janeiro', 'fevereiro', 'março', 'abril',
  'maio', 'junho', 'julho', 'agosto',
  'setembro', 'outubro', 'novembro', 'dezembro'
]

export default function formatDate(date) {
  const [year, month, day] = date.split('-')

  const monthText = months[parseInt(month) - 1]

  return `${day} de ${monthText}, ${year}`
}
