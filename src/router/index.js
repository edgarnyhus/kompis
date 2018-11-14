import Vue from 'vue'
import Router from 'vue-router'
import MyCV from '@/components/views/MyCV'
import WorkExperience from '@/components/views/WorkExperience'
import Education from '@/components/views/Education'
import KeyValue from '@/components/views/KeyValue'
import PracticalSkill from '@/components/views/PracticalSkill'
import Volunteering from '@/components/views/Volunteering'
import Language from '@/components/views/Language'
import Reference from '@/components/views/Reference'
import PracticeCertificate from '@/components/views/PracticeCertificate'
import PracticeCertificateView from '@/components/views/PracticeCertificateView'
import ShowPracticeCertificate from '@/components/views/ShowPracticeCertificate'
import PersonalGoal from '@/components/views/PersonalGoal'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import ShowMedia from '@/components/common/ShowMedia'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/',
      name: 'MyCV',
      component: MyCV,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/work',
      name: 'WorkExperience',
      component: WorkExperience,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/education',
      name: 'Education',
      component: Education,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/keyvalue',
      name: 'KeyValue',
      component: KeyValue,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/skill',
      name: 'PracticalSkill',
      component: PracticalSkill,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/volunteering',
      name: 'Volunteering',
      component: Volunteering,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/lang',
      name: 'Language',
      component: Language,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ref',
      name: 'Reference',
      component: Reference,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/practice',
      name: 'PracticeCertificateView',
      component: PracticeCertificateView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/cert',
      name: 'PracticeCertificate',
      component: PracticeCertificate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/certview',
      name: 'ShowPracticeCertificate',
      component: ShowPracticeCertificate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/goal',
      name: 'PersonalGoal',
      component: PersonalGoal,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/media',
      name: 'ShowMedia',
      component: ShowMedia,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
router.replace({ path: '*', redirect: '/' })

// router guards
router.beforeEach((to, from, next) => {
  // check to see if route has auth guard
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if (user) {
      // User is signed in. Proceed to route
      next()
    } else {
      // No user is signed in. Redirect to login
      next({
        name: 'Login'
      })
    }
  } else {
    // if route is not guarded by auth, proceed
    next()
  }
})

export default router
