<template>
    <div class="header">
        <img src="../assets/sticksnstones_logo.png" alt="Logo Sticks N Stones">
        <div class = "nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/myitems">My Items</router-link> |
          <router-link to="/upload">Upload</router-link> |
        </div>
        <auth-component/>
    </div>
</template>

<script>

import AuthComponent from './AuthComponent.vue'

export default {
  components: { AuthComponent }
}
</script>
