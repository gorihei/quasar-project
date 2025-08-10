import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('../pages/IndexPage.vue') },
      { path: 'roulette', name: 'roulette', component: () => import('../pages/RoulettePage.vue') },
      {
        path: 'bingo/host',
        name: 'bingo-host',
        component: () => import('../pages/BingoHostPage.vue'),
      },
      {
        path: 'bingo/card',
        name: 'bingo-card',
        component: () => import('../pages/BingoCardPage.vue'),
      },
      { path: 'amida', name: 'amida', component: () => import('../pages/AmidaPage.vue') },
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
