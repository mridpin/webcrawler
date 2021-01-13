<template>
  <div id="app" class="container">
    <img alt="Vue logo" src="./assets/logo.png" class="image container">
    <h1 class="title is-3">Webcrawler</h1>
    <Webcrawler />
  </div>
</template>

<script>
import Webcrawler from './components/Webcrawler.vue'

export default {
  name: 'App',
  components: {
    Webcrawler
  }
}
</script>