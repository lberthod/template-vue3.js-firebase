<template>
  <div class="container container-sm">
    <div class="contact-page">
      <h1>{{ $t('contact.title') }}</h1>
      
      <form @submit.prevent="handleSubmit" class="contact-form card">
        <div class="form-group">
          <label for="email">{{ $t('contact.email.label') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="$t('contact.email.placeholder')"
            @blur="validateField('email')"
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="message">{{ $t('contact.message.label') }}</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="6"
            :placeholder="$t('contact.message.placeholder')"
            @blur="validateField('message')"
          ></textarea>
          <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
        </div>
        
        <button type="submit" :disabled="submitting" class="btn">
          {{ submitting ? $t('contact.submitting') : $t('contact.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { required, email, minLen, maxLen, runValidators } from '../helpers/validate'
import { useToast } from '../composables/useToast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

const form = reactive({
  email: '',
  message: ''
})

const errors = reactive({
  email: '',
  message: ''
})

const submitting = ref(false)

const validators = {
  email: [required, email],
  message: [required, minLen(10), maxLen(500)]
}

const validateField = (field) => {
  errors[field] = runValidators(form[field], validators[field])
}

const validateForm = () => {
  let isValid = true
  
  Object.keys(validators).forEach(field => {
    validateField(field)
    if (errors[field]) {
      isValid = false
    }
  })
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error(t('contact.error.validation'))
    return
  }
  
  try {
    submitting.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Success
    toast.success(t('contact.success'))
    
    // Reset form
    form.email = ''
    form.message = ''
    Object.keys(errors).forEach(key => errors[key] = '')
  } catch (error) {
    toast.error(t('contact.error.send'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding: var(--spacing-xl) 0;
}

.contact-page h1 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
