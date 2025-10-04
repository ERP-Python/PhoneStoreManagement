/**
 * Format number with thousand separators (using dot)
 * Example: 1000000 -> 1.000.000
 */
export const formatNumber = (number) => {
  if (!number && number !== 0) return ''
  // Remove all dots first, then format
  const cleaned = number.toString().replace(/\./g, '')
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Parse formatted number back to number
 * Example: 1.000.000 -> 1000000
 */
export const parseFormattedNumber = (formattedNumber) => {
  if (!formattedNumber && formattedNumber !== 0) return 0
  const cleaned = formattedNumber.toString().replace(/\./g, '')
  const number = parseFloat(cleaned)
  return isNaN(number) ? 0 : number
}

/**
 * Format number for display (read-only)
 */
export const formatNumberDisplay = (number) => {
  if (!number && number !== 0) return '0'
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Format currency (VND)
 * Example: 1000000 -> 1.000.000 ₫
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ₫'
  return `${formatNumber(amount)} ₫`
}

/**
 * Handle number input change with formatting
 */
export const handleNumberInput = (e, setValue) => {
  const value = e.target.value.replace(/\./g, '') // Remove dots
  const number = parseFloat(value)
  if (!isNaN(number) && number >= 0) {
    setValue(number)
  } else if (value === '') {
    setValue('')
  }
}

