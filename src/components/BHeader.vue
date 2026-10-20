<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../stores/auth'
import { firebaseUser } from '../stores/firebaseAuth'

const router = useRouter()
const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3 border-bottom">
      <ul class="nav nav-pills align-items-center gap-1">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" active-class="active" exact-active-class="active"
            >Home (Week 5)</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link" active-class="active">About</RouterLink>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/login" class="nav-link" active-class="active">Login</RouterLink>
        </li>
        <li v-else class="nav-item">
          <button class="btn btn-outline-danger ms-2" type="button" @click="handleLogout">
            Logout
          </button>
        </li>
        <li class="nav-item">
          <RouterLink to="/FireRegister" class="nav-link" active-class="active"
            >Firebase Register</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link" active-class="active"
            >Firebase Login</RouterLink
          >
        </li>
        <li v-if="firebaseUser" class="nav-item">
          <RouterLink to="/FireLogout" class="nav-link" active-class="active"
            >Firebase Logout</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/addbook" class="nav-link" active-class="active">Add Book</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/getbookcount" class="nav-link" active-class="active"
            >Get Book Count</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/WeatherCheck" class="nav-link" active-class="active"
            >Get Weather</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/GetAllBookAPI" class="nav-link" active-class="active"
            >Get All Book API</RouterLink
          >
        </li>
      </ul>
    </header>
  </div>
</template>
