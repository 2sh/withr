import { createWebHashHistory, createRouter } from 'vue-router'

import MainView from './views/Main.vue'

const routes = [
  { path: '/:location?', component: MainView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router