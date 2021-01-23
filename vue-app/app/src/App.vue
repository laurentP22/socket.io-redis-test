<template>
  <div id="app">
    <Navbar/>
    <div class = "container"  style="padding-top: 25px">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'app',
  components:{
    Navbar
  }
}
</script>
