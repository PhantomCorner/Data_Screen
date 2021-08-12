import Vue from 'vue'
import App from './App.vue'
import * as axios from 'axios'
import * as echarts from 'echarts'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)
//引用axios
Vue.prototype.axios=axios
//引用echarts
Vue.prototype.$echarts=echarts
new Vue({
  render: h => h(App),
}).$mount('#app')
