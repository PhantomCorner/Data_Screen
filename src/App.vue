<template>
  <div id="app">
    <Header></Header>
    <Wrapper></Wrapper>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import Header from '@/components/Header'
import Wrapper from '@/components/Wrapper'
export default {
  name: 'App',
  components: {
    Header,
    Wrapper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}


</style>
