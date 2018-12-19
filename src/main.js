// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'
import firebase from 'firebase'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
 
Vue.use(VueMaterial);
Vue.use(BootstrapVue);
Vue.config.productionTip = false

firebase.database.enableLogging(true)

Vue.filter('formatDate', function(value) {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        let date = moment.unix(value.seconds).format('ll')
        return date.substring(0,3) + ' ' + date.substring(7,12)
    }
})
Vue.filter('formatDateAndTime', function(value) {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        let date = moment(value).format('lll')
        return date
    }
})

Vue.filter('truncateFilename', function(value) {
    if (value) {
        return (filename.length > 11 ? filename.substring(0, 11) + '...' : filename);
    }
})

global.getMonth = (value) => {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        // let date = moment(value)
        let n = moment.unix(value.seconds).month() + 1
        if (n < 10)
            return '0' + String(n)
        return String(n)
    }
    return null;
}

global.getYear = (value) => {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        // let date = moment(value)
        let n = moment.unix(value.seconds).year()
        if (n < 10)
            return '0' + String(n)
        return String(n)
    }
    return null;
}

global.toTimestamp = (month, year) => {
    let date = month + '-' + '10-' + year
    return new Date(date)
}

// global.isMobile = () => {
//     if( screen.width <= 760 ) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

// global.isSmallScreen = () => {
//     if ((this.windowWidth < 768) || /Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//         return true
//     } else {
//         return false
//     }
// }



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

// const mixin = new Vue.mixin({
//     computed: {
//         isMobile() {
//             // if((this.windowWidth < 768) || /Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//             if (this.windowWidth < 768) {
//                 ret = true
//             } else {
//                 ret = false
//             }
//             console.log('smallScreen', ret)
//             return ret
//         }
//     },
//     data() {
//         return {
//             windowWidth: 0
//         }
//     },
//     methods: {
//         handleWindowResize(event) { 
//             this.windowWidth = event.currentTarget.innerWidth; 
//             console.log('resize', this.windowWidth)
//         },
//     },
//     beforeDestroy: function () {
//         window.removeEventListener('resize', this. handleWindowResize)
//     },
//     mounted() {
//         window.addEventListener('resize', this.handleWindowResize);
//    }
// })
  
const vm = new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    mixins: [],
    data() {
        return {
            windowWidth: 0
        }
    },
    methods: {
        handleWindowResize(event) { 
            this.windowWidth = event.currentTarget.innerWidth; 
            console.log('resize', this.windowWidth)
        },
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this. handleWindowResize)
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize);
    }
})

Vue.prototype.$isSmallScreen = function() {
    if (this.windowWidth < 760) {
        ret = true
    } else {
        ret = false
    }
    console.log('isMobile', ret)
    return ret
}

console.log(vm)
