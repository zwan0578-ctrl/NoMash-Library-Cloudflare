import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import { isAuthenticated } from '../stores/auth'
import { firebaseReady, firebaseUser, isFirebaseAdmin } from '../stores/firebaseAuth'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import FirebaseAdminView from '../views/FirebaseAdminView.vue'

import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import GetAllBookAPIView from '../views/GetAllBookAPIView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/getbookcount', name: 'GetBookCount', component: GetBookCountView },
    { path: '/WeatherCheck', name: 'GetWeather', component: WeatherView },
    {
      path: '/GetAllBookAPI',
      alias: '/CountBookAPI',
      name: 'GetAllBookAPI',
      component: GetAllBookAPIView,
      meta: { apiView: true }
    },
    { path: '/addbook', name: 'AddBook', component: AddBookView },
    { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView },
    { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegisterView },
    { path: '/FireLogout', name: 'FireLogout', component: FirebaseLogoutView },
    {
      path: '/FireAdmin',
      name: 'FireAdmin',
      component: FirebaseAdminView,
      meta: { firebaseAdmin: true }
    },
    { path: '/', name: 'Home', component: HomeView },
    { path: '/about', name: 'About', component: AboutView, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/access-denied', name: 'AccessDenied', component: AccessDeniedView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  await firebaseReady
  if (to.meta.firebaseAdmin) {
    if (!firebaseUser.value) return { name: 'FireLogin' }
    if (!isFirebaseAdmin.value) return { name: 'AccessDenied', query: { reason: 'admin' } }
  }
  if (to.meta.requiresAuth && !isAuthenticated.value && !firebaseUser.value) {
    return { name: 'Login', query: { redirect: to.fullPath, denied: '1' } }
  }
})

export default router
