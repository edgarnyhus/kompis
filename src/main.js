// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'

Vue.use(BootstrapVue);
Vue.config.productionTip = false

Vue.filter('formatDate', function(value) {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        let date = moment.unix(value.seconds).format('ll')
        return date.substring(0,3) + ' ' + date.substring(7,12)
    }
})

global.toTimestamp = (month, year) => {
  let date =month + '-' + '10-' + year
  return new Date(date)

//   let date = ''   // month + '-' + '01-' + year

//   if (!year) {
//       return date
//   }

//   if (month) {
//       date = month + '-01-'
//   } else {
//       date ='01-01-'
//   }
//   date += year
//   return new Date(date)

}

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
