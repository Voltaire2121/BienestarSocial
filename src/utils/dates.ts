export const getDateFromObject = (date: any) => {
  if (!date) return null

  if (date instanceof Date) {
    return date
  }

  if (typeof date === 'object' && 'seconds' in date) {
    return new Date(date.seconds * 1000)
  }

  // If is not a Date or a Timestamp from firebase, return null value
  return null
}

export const getActualFormattedDate = () => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  return `${today.getFullYear()}/${day}/${month}`
}
