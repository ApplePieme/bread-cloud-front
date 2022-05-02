import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: { title: '全部文件', icon: 'menu-dir' }
      },
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: { title: '学习资料', icon: 'menu-dir' },
        hidden: true
      }
    ]
  },

  {
    path: '/transfer',
    component: Layout,
    redirect: '/transfer',
    children: [
      {
        path: 'transfer',
        name: 'transfer',
        component: () => import('@/views/transfer/index'),
        meta: { title: '传输记录', icon: 'transfer-record' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
