// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue);
Vue.config.productionTip = false

// // Register a global custom directive called `v-focus`
// Vue.directive('focus', {
//   // When the bound element is inserted into the DOM...
//   inserted: function (el) {
//     // Focus the element
//     el.focus()
//   },
//   // When the bound element is updated in the DOM...
//   update: function (el) {
//     // Focus the element
//     el.focus()
//   }
// })

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
