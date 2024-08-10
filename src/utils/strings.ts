export const CheckEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const normalizeString = (str: string) => {
  return str
    .normalize('NFD') // Normalize to decompose combined characters into base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove the diacritical marks (accents)
    .toLowerCase() // Convert the string to lowercase
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except for alphanumeric and spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim() // Trim leading and trailing spaces
}

export const toProperCase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt: string): string {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  })
}
