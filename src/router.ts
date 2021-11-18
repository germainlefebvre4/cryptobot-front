import Vue from 'vue';
import Router from 'vue-router';

import RouterComponent from './components/RouterComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "start" */ './views/main/Start.vue'),
      children: [
        {
          path: 'login',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
        },
        {
          path: 'recover-password',
          component: () => import(/* webpackChunkName: "recover-password" */ './views/PasswordRecovery.vue'),
        },
        {
          path: 'reset-password',
          component: () => import(/* webpackChunkName: "reset-password" */ './views/ResetPassword.vue'),
        },
        {
          path: 'register',
          component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
        },
        {
          path: 'main',
          component: () => import(/* webpackChunkName: "main" */ './views/main/Main.vue'),
          children: [
            {
              path: 'dashboard',
              component: () => import(/* webpackChunkName: "main-dashboard" */ './views/main/Dashboard.vue'),
            },
            {
              path: 'profile',
              component: RouterComponent,
              redirect: 'profile/view',
              children: [
                {
                  path: 'view',
                  component: () => import(
                    /* webpackChunkName: "main-profile" */ './views/main/profile/UserProfile.vue'),
                },
                {
                  path: 'edit',
                  component: () => import(
                    /* webpackChunkName: "main-profile-edit" */ './views/main/profile/UserProfileEdit.vue'),
                },
                {
                  path: 'password',
                  component: () => import(
                    /* webpackChunkName: "main-profile-password" */ './views/main/profile/UserProfileEditPassword.vue'),
                },
              ],
            },
            {
              path: 'cryptobots',
              component: RouterComponent,
              redirect: 'cryptobots/view',
              children: [
                {
                  path: 'view',
                  component: () => import(
                    /* webpackChunkName: "main-cryptobots" */ './views/main/cryptobots/Cryptobots.vue'),
                },
                {
                  path: 'view/:id',
                  name: 'main-cryptobots-view',
                  component: () => import(
                    /* webpackChunkName: "main-cryptobots" */ './views/main/cryptobots/CryptobotView.vue'),
                },
                {
                  path: 'create',
                  component: () => import(
                    /* webpackChunkName: "main-cryptobots" */ './views/main/cryptobots/CryptobotCreateOrEdit.vue'),
                },
                {
                  path: 'edit/:id',
                  name: 'main-cryptobots-edit',
                  component: () => import(
                    /* webpackChunkName: "main-cryptobots" */ './views/main/cryptobots/CryptobotCreateOrEdit.vue'),
                },
              ],
            },
            {
              path: 'binance/accounts',
              component: RouterComponent,
              redirect: 'binance/accounts/view',
              children: [
                {
                  path: 'view',
                  component: () => import(
                    /* webpackChunkName: "main-binance-accounts" */
                    './views/main/binance_accounts/BinanceAccounts.vue'),
                },
                {
                  path: 'view/:id',
                  name: 'main-binance-accounts-view',
                  component: () => import(
                    /* webpackChunkName: "main-binance-accounts" */
                    './views/main/binance_accounts/BinanceAccountView.vue'),
                },
                {
                  path: 'create',
                  component: () => import(
                    /* webpackChunkName: "main-binance-accounts" */
                    './views/main/binance_accounts/BinanceAccountCreateOrEdit.vue'),
                },
                {
                  path: 'edit/:id',
                  name: 'main-binance-accounts-edit',
                  component: () => import(
                    /* webpackChunkName: "main-binance-accounts" */ './views/main/binance_accounts/BinanceAccountCreateOrEdit.vue'),
                },
              ],
            },
            {
              path: 'telegrams',
              component: RouterComponent,
              redirect: 'telegrams/view',
              children: [
                {
                  path: 'view',
                  component: () => import(
                    /* webpackChunkName: "main-telegrams" */
                    './views/main/telegrams/Telegrams.vue'),
                },
                {
                  path: 'view/:id',
                  name: 'main-telegrams-view',
                  component: () => import(
                    /* webpackChunkName: "main-telegrams" */
                    './views/main/telegrams/TelegramView.vue'),
                },
                {
                  path: 'create',
                  component: () => import(
                    /* webpackChunkName: "main-telegrams" */
                    './views/main/telegrams/TelegramCreateOrEdit.vue'),
                },
                {
                  path: 'edit/:id',
                  name: 'main-telegrams-edit',
                  component: () => import(
                    /* webpackChunkName: "main-telegrams" */ './views/main/telegrams/TelegramCreateOrEdit.vue'),
                },
              ],
            },
            {
              path: 'margin',
              component: RouterComponent,
              redirect: 'margin/board/trades/last',
              children: [
                {
                  path: 'board/trades/last',
                  component: () => import(
                    /* webpackChunkName: "main-margin-board-trades-last" */
                    './views/main/margin/boards/LastTrade.vue'),
                },
                {
                  path: 'board/trades/run',
                  component: () => import(
                    /* webpackChunkName: "main-margin-board-trades-run" */
                    './views/main/margin/boards/RunTrades.vue'),
                },
                {
                  path: 'currency/view',
                  component: () => import(
                    /* webpackChunkName: "main-margin-currencies" */
                    './views/main/margin/Currencies.vue'),
                },
                {
                  path: 'currency/create',
                  component: () => import(
                    /* webpackChunkName: "main-margin-currency" */
                    './views/main/margin/CurrencyCreateOrEdit.vue'),
                },
              ],
            },
            {
              path: 'admin',
              component: () => import(/* webpackChunkName: "main-admin" */ './views/main/admin/Admin.vue'),
              redirect: 'admin/users/all',
              children: [
                {
                  path: 'users',
                  redirect: 'users/all',
                },
                {
                  path: 'users/all',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users" */ './views/main/admin/AdminUsers.vue'),
                },
                {
                  path: 'users/edit/:id',
                  name: 'main-admin-users-edit',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users-edit" */ './views/main/admin/EditUser.vue'),
                },
                {
                  path: 'users/create',
                  name: 'main-admin-users-create',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users-create" */ './views/main/admin/CreateUser.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/*', redirect: '/',
    },
  ],
});
