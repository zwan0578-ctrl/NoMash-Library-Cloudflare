import { computed, ref, shallowRef } from 'vue'
import { onIdTokenChanged, getIdTokenResult, signOut } from 'firebase/auth'
import { firebaseAuth } from '../firebase'

export const firebaseUser = shallowRef(null)
export const firebaseRole = ref(null)
export const firebaseSessionError = ref('')
export const isFirebaseAdmin = computed(() => firebaseRole.value === 'admin')

export function currentUserSummary() {
  const user = firebaseUser.value
  return user ? { uid: user.uid, email: user.email, role: firebaseRole.value } : null
}

// Only trusted Firebase custom claims can grant the administrator role.
export async function syncFirebaseUser(user) {
  firebaseUser.value = user
  firebaseRole.value = null
  firebaseSessionError.value = ''
  if (user) {
    try {
      const { claims } = await getIdTokenResult(user)
      if (firebaseAuth.currentUser?.uid === user.uid) {
        firebaseRole.value = claims.role === 'admin' || claims.admin === true ? 'admin' : 'member'
      }
    } catch {
      firebaseSessionError.value = 'Unable to load your role. Please sign in again.'
    }
  }
}

export const firebaseReady = firebaseAuth
  ? new Promise((resolve) => {
      onIdTokenChanged(
        firebaseAuth,
        async (user) => {
          await syncFirebaseUser(user)
          resolve()
        },
        () => {
          firebaseSessionError.value = 'Unable to restore your session. Please sign in again.'
          resolve()
        }
      )
    })
  : Promise.resolve()

export async function logoutFirebase() {
  await signOut(firebaseAuth)
  await syncFirebaseUser(null)
  console.log('Firebase sign out successful!')
  console.log('Current user:', firebaseAuth.currentUser)
}

export function authErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Please use a stronger password (at least 6 characters).',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/operation-not-allowed': 'Enable Email/Password in Firebase Authentication first.'
  }
  return (
    messages[error.code] ||
    'Authentication failed. Please check your Firebase settings and try again.'
  )
}
