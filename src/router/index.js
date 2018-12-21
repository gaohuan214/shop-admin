import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (to.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})
export default router
