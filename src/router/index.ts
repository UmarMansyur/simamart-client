import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes : Array<RouteRecordRaw> = [
    { path: '/', name: 'Page1', component: () => import('../views/Page1.vue') },
    {
        path: '/transaksi',
        name: 'Page2',
        component: () => import('../views/Page2.vue'),
    }

]

const router = createRouter ({
    history: createWebHistory(''),
    routes
});

  
  export default router