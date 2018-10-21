import Vue from 'vue'
import Router from 'vue-router'
import MyCV from '@/components/views/MyCV'
import WorkExperience from '@/components/views/WorkExperience'
import KeyCompetence from '@/components/views/KeyCompetence'
import PracticalSkill from '@/components/views/PracticalSkill'
import PracticeCertificate from '@/components/views/PracticeCertificate'
import PracticeCertificateView from '@/components/views/PracticeCertificateView'
import PersonalGoal from '@/components/views/PersonalGoal'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import firebase from 'firebase'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyCV',
      component: MyCV
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/work',
      name: 'WorkExperience',
      component: WorkExperience
    },
    {
      path: '/keyvalues',
      name: 'KeyCompetence',
      component: KeyCompetence
    },
    {
      path: '/skill',
      name: 'PracticalSkill',
      component: PracticalSkill
    },
    {
      path: '/practice',
      name: 'PracticeCertificateView',
      component: PracticeCertificateView
    },
    {
      path: '/cert',
      name: 'PracticeCertificate',
      component: PracticeCertificate
    },
    {
      path: '/goal',
      name: 'PersonalGoal',
      component: PersonalGoal
    }
  ]
})

// router guards
// router.beforeEach((to, from, next) => {
//   // check to see if route has auth guard
//   if(to.matched.some(rec => rec.meta.requiresAuth)){
//     // check auth state of user
//     let user = firebase.auth().currentUser
//     if (user) {
//       // User is signed in. Proceed to route
//       next()
//     } else {
//       // No user is signed in. Redirect to login
//       next({
//         name: 'Login'
//       })
//     }
//   } else {
//     // if route is not guarded by auth, proceed
//     next()
//   }
// })

