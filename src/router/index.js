import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import User from '@/components/Users'

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
    },
    {
      path: '/home',
      component: Home,
      // children 用于适配home的子路由
      children: [
        {
          path: '/users',
          component: User
        }
      ]
    }
  ]
})
// 导航守卫:路由发生变化时会触发beforeEach这个回调函数
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
