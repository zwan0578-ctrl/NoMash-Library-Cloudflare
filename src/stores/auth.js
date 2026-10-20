import { ref } from 'vue'

export const isAuthenticated = ref(sessionStorage.getItem('library-authenticated') === 'true')

export const login = (username, password) => {
  const valid = username === 'student' && password === 'library123'
  isAuthenticated.value = valid
  if (valid) sessionStorage.setItem('library-authenticated', 'true')
  return valid
}

export const logout = () => {
  isAuthenticated.value = false
  sessionStorage.removeItem('library-authenticated')
}
