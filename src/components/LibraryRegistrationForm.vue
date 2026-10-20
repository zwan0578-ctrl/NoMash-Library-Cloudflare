<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])
const errors = ref({ username: null, password: null, confirmPassword: null })
const success = ref({ reason: null })

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else errors.value.username = null
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const rules = [
    [password.length >= 8, 'Password must be at least 8 characters long.'],
    [/[A-Z]/.test(password), 'Password must contain at least one uppercase letter.'],
    [/[a-z]/.test(password), 'Password must contain at least one lowercase letter.'],
    [/\d/.test(password), 'Password must contain at least one number.'],
    [/[!@#$%^&*(),.?":{}|<>]/.test(password), 'Password must contain at least one special character.']
  ]
  const failedRule = rules.find(([passes]) => !passes)
  if (failedRule) {
    if (blur) errors.value.password = failedRule[1]
  } else errors.value.password = null
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else errors.value.confirmPassword = null
}

const validateReason = () => {
  success.value.reason = /\bfriend\b/i.test(formData.value.reason) ? 'Great to have a friend' : null
}

const clearForm = () => {
  formData.value = { username: '', password: '', confirmPassword: '', isAustralian: false, reason: '', gender: '', suburb: 'Clayton' }
  errors.value = { username: null, password: null, confirmPassword: null }
  success.value.reason = null
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}
</script>

<template>
  <section class="registration-shell" aria-labelledby="registration-title">
    <div class="text-center mb-4">
      <h1 id="registration-title">🗄️ W5. Library Registration Form</h1>
      <p class="text-muted mb-0">Let's build some more advanced features into our form.</p>
    </div>

    <form class="registration-form" @submit.prevent="submitForm" novalidate>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label for="username" class="form-label">Username</label>
          <input id="username" v-model="formData.username" type="text" class="form-control" @blur="validateName(true)" @input="validateName(false)" />
          <div v-if="errors.username" class="text-danger validation-message">{{ errors.username }}</div>
        </div>
        <div class="col-md-6">
          <label for="gender" class="form-label">Gender</label>
          <select id="gender" v-model="formData.gender" class="form-select">
            <option disabled value="">Please select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="password" class="form-label">Password</label>
          <input id="password" v-model="formData.password" type="password" class="form-control" @blur="validatePassword(true)" @input="validatePassword(false)" />
          <div v-if="errors.password" class="text-danger validation-message">{{ errors.password }}</div>
        </div>
        <div class="col-md-6">
          <label for="confirm-password" class="form-label">Confirm password</label>
          <input id="confirm-password" v-model="formData.confirmPassword" type="password" class="form-control" @blur="validateConfirmPassword(true)" />
          <div v-if="errors.confirmPassword" class="text-danger validation-message">{{ errors.confirmPassword }}</div>
        </div>
      </div>

      <div class="form-check mb-3">
        <input id="isAustralian" v-model="formData.isAustralian" type="checkbox" class="form-check-input" />
        <label class="form-check-label" for="isAustralian">Australian Resident?</label>
      </div>

      <div class="mb-3">
        <label for="reason" class="form-label">Reason for joining</label>
        <textarea id="reason" v-model="formData.reason" class="form-control" rows="3" @input="validateReason"></textarea>
        <div v-if="success.reason" class="text-success validation-message">{{ success.reason }}</div>
      </div>

      <div class="mb-4">
        <label for="suburb" class="form-label">Suburb</label>
        <input id="suburb" type="text" class="form-control" :value="formData.suburb" />
        <div class="form-text">This field uses one-way <code>v-bind</code>; edit it and inspect <code>formData.suburb</code> in Vue DevTools.</div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2">Submit</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
      </div>
    </form>
  </section>

  <section class="mt-5" aria-labelledby="datatable-title">
    <h4 id="datatable-title">This is a PrimeVue DataTable.</h4>
    <DataTable :value="submittedCards" stripedRows tableStyle="min-width: 50rem">
      <Column field="username" header="Username" />
      <Column field="password" header="Password" />
      <Column field="isAustralian" header="Australian Resident" />
      <Column field="gender" header="Gender" />
      <Column field="reason" header="Reason" />
    </DataTable>
  </section>
</template>

<style scoped>
.registration-shell { max-width: 900px; margin: 3rem auto 0; }
.validation-message { font-size: 0.92rem; margin-top: 0.25rem; font-weight: 500; }
</style>
