import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      component: resolve => require(['../components/Login.vue'], resolve)
    },
    {
      path: '/',
      component: resolve => require(['../components/page/Layout.vue'], resolve),
      children: [{
          path: '/',
          component: resolve => require(['../components/index.vue'], resolve),
          meta: {
            title: '首页->首页'
          },
        },
        {
          path: '/audit/consumables_order',
          component: resolve => require(['../components/audit/consumables_order.vue'], resolve),
          meta: {
            title: '审批->耗材审批'
          },
        },
        {
          path: '/data_management/consumables/consumables_data_management',
          component: resolve => require(['../components/data_management/consumables/consumables_data_management.vue'], resolve),
          meta: {
            title: '耗材管理->耗材基础资料管理'
          }
        },
        {
          path: '/data_management/consumables/consumables_inventory',
          component: resolve => require(['../components/data_management/consumables/consumables_inventory.vue'], resolve),
          meta: {
            title: '耗材管理->耗材库存'
          }
        },
      ]
    },
  ]
})
