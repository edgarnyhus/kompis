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
// import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
// import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueMaterial);
// Vue.use(MdButton)
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

firebase.database.enableLogging(true);

Vue.filter('formatDate', function(value) {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        let date = moment.unix(value.seconds).format('ll');
        return date.substring(0,3) + ' ' + date.substring(7,12);
    }
})

Vue.filter('formatDateAndTime', function(value) {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        let date = moment(value).format('lll');
        return date;
    }
})

//credit to @Bill Criswell for this filter
Vue.filter('truncate', function (text, stop, clamp) {
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
})

global.getMonth = (value) => {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        // let date = moment(value)
        let n = moment.unix(value.seconds).month() + 1;
        if (n < 10)
            return '0' + String(n);
        return String(n);
    }
    return null;
}

global.getYear = (value) => {
    if (value) {
        // return moment(String(value)).format('MM/DD/YYYY hh:mm')
        // let date = moment(value)
        let n = moment.unix(value.seconds).year();
        if (n < 10)
            return '0' + String(n);
        return String(n);
    }
    return null;
}

global.toTimestamp = (month, year) => {
    let date = month + '-' + '10-' + year;
    return new Date(date);
}
  

// TODO: use a Vuex store instead of this globalData thing
let globalData = new Vue({
    data: { 
        $smallScreen: false,
        user: null
     }
});

Vue.mixin({
    computed: {
      $smallScreen: {
        get: function () { return globalData.$data.$smallScreen; },
        set: function (value) { globalData.$data.$smallScreen = value; }
      },
      $user: {
        get: function () { return globalData.$data.$user; },
        set: function (value) { globalData.$data.$user = value; }
      }
    }
});
  
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
            this.$smallScreen = (this.windowWidth < 770);
            // this.$smallScreen = ((this.windowWidth < 770) || /Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            // console.log('resize', this.windowWidth, this.$smallScreen)
        },
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this. handleWindowResize);
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize);
        this.windowWidth = window.innerWidth;
        this.$smallScreen = (this.windowWidth < 770);
        // this.$smallScreen = ((this.windowWidth < 770) || /Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
});


console.log(vm)
