import { describe, it, expect } from 'vitest'
import { required, email, minLen, maxLen, runValidators } from './validate'

describe('Validators', () => {
  describe('required', () => {
    it('should return error for empty values', () => {
      expect(required('')).toBeTruthy()
      expect(required(null)).toBeTruthy()
      expect(required(undefined)).toBeTruthy()
    })
    
    it('should return null for non-empty values', () => {
      expect(required('value')).toBeNull()
      expect(required(0)).toBeNull()
    })
  })
  
  describe('email', () => {
    it('should validate correct emails', () => {
      expect(email('test@example.com')).toBeNull()
      expect(email('user+tag@domain.co.uk')).toBeNull()
    })
    
    it('should reject invalid emails', () => {
      expect(email('invalid')).toBeTruthy()
      expect(email('test@')).toBeTruthy()
      expect(email('@example.com')).toBeTruthy()
    })
    
    it('should return null for empty values', () => {
      expect(email('')).toBeNull()
      expect(email(null)).toBeNull()
    })
  })
  
  describe('minLen', () => {
    it('should validate minimum length', () => {
      const validator = minLen(5)
      expect(validator('12345')).toBeNull()
      expect(validator('123456')).toBeNull()
      expect(validator('1234')).toBeTruthy()
    })
    
    it('should return null for empty values', () => {
      const validator = minLen(5)
      expect(validator('')).toBeNull()
      expect(validator(null)).toBeNull()
    })
  })
  
  describe('maxLen', () => {
    it('should validate maximum length', () => {
      const validator = maxLen(5)
      expect(validator('12345')).toBeNull()
      expect(validator('1234')).toBeNull()
      expect(validator('123456')).toBeTruthy()
    })
    
    it('should return null for empty values', () => {
      const validator = maxLen(5)
      expect(validator('')).toBeNull()
      expect(validator(null)).toBeNull()
    })
  })
  
  describe('runValidators', () => {
    it('should run multiple validators', () => {
      const validators = [required, email]
      expect(runValidators('', validators)).toBeTruthy()
      expect(runValidators('invalid', validators)).toBeTruthy()
      expect(runValidators('test@example.com', validators)).toBeNull()
    })
    
    it('should stop at first error', () => {
      const validators = [required, email, minLen(20)]
      const result = runValidators('', validators)
      expect(result).toBeTruthy()
      expect(result).toContain('requis')
    })
  })
})
