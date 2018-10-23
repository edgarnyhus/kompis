import Vue from 'vue'
import Router from 'vue-router'
import MyCV from '@/components/views/MyCV'
import WorkExperience from '@/components/views/WorkExperience'
import Education from '@/components/views/Education'
import KeyCompetence from '@/components/views/KeyCompetence'
import PracticalSkill from '@/components/views/PracticalSkill'
import PracticeCertificate from '@/components/views/PracticeCertificate'
import PracticeCertificateView from '@/components/views/PracticeCertificateView'
import JobTraining from '@/components/views/JobTraining'
import PersonalGoal from '@/components/views/PersonalGoal'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/home',
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
      path: '/keyvalues',
      name: 'KeyCompetence',
      component: KeyCompetence,
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
      path: '/practice',
      name: 'PracticeCertificateView',
      component: PracticeCertificateView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/training',
      name: 'JobTraining',
      component: JobTraining,
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
      path: '/goal',
      name: 'PersonalGoal',
      component: PersonalGoal,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

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
