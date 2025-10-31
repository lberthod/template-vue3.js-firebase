/**
 * Validation helpers
 */

export const required = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Ce champ est requis'
  }
  return null
}

export const email = (value) => {
  if (!value) return null
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Email invalide'
  }
  return null
}

export const minLen = (min) => (value) => {
  if (!value) return null
  
  if (value.length < min) {
    return `Minimum ${min} caractères`
  }
  return null
}

export const maxLen = (max) => (value) => {
  if (!value) return null
  
  if (value.length > max) {
    return `Maximum ${max} caractères`
  }
  return null
}

export const runValidators = (value, validators = []) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

export default {
  required,
  email,
  minLen,
  maxLen,
  runValidators
}
