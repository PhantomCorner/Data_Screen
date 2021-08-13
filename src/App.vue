<template>
  <div id="app">
  <Wrapper></Wrapper>
    <swiper ref="Swiper" :options="mySwiperOpt">
      <swiper-slide>
        
      </swiper-slide>
      <swiper-slide>
        <Header></Header>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import Header from '@/components/Header'
import Wrapper from '@/components/Wrapper'
export default {
  name: 'App',
  data() {
    return {
        mySwiperOpt: {
          pagination: {
            el: '.swiper-pagination'
          },
          // Some Swiper option/callback...
        }
    }
  },
  computed:{
    swiper() {
        return this.$refs.Swiper.swiper
      }
  },
  mounted() {
      //console.log('Current Swiper instance object', this.swiper)
      this.swiper.slideTo(1, 3000, false)
    },
  components: {
    Header,
    Wrapper,
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #b3ccf8;
}
</style>
