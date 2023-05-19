export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/moduleName',
        name: 'moduleName',
        routes: [{ path: '/moduleName/demo', component: './Demo' }],
      },
      {
        path: '/basic',
        name: '基础配置',
        routes: [
          {
            path: '/basic/standardProcedure',
            component: './Basic/StandardProcedure',
            title: '标准工序',
          },
          {
            path: '/basic/standardProcess',
            component: './Basic/StandardProcess',
            title: '标准工艺',
          },
          {
            path: '/basic/organize',
            component: './Basic/Organize',
            title: '组织架构',
          },
          {
            path: '/basic/orgProcess',
            component: './Basic/OrganizeProcess',
            title: '组织工序',
          },
          {
            path: '/basic/materialProcess',
            component: './Basic/MaterialProcess',
            title: '料品工艺',
          },
          {
            path: '/basic/holiday',
            component: './Basic/Holiday',
            title: '节假日配置',
          },
          {
            path: '/basic/workTimes',
            component: './Basic/WorkTimes',
            title: '上班日期配置',
          },
          {
            path: '/basic/materialCapacity',
            component: './Basic/MaterialCapacity',
            title: '标准产能',
          },
        ],
      },
      {
        path: '/order',
        name: '订单',
        routes: [
          {
            path: '/order/planInner',
            component: './Order/PlanInner',
            title: '内部待排',
          },
          {
            path: '/order/stampingOrder',
            component: './Order/StampingOrder',
            title: '冲压车间订单',
          },
          {
            path: '/order/productionPlan',
            component: './Order/ProductionPlan',
            title: '生产计划',
          },
          {
            path: '/order/productionPlanSon',
            component: './Order/ProductionPlanSon',
            title: '子件生产计划',
          },
          {
            path: '/order/purchasePlan',
            component: './Order/PurchasePlan',
            title: '委外计划',
          },
          {
            path: '/order/allOrder',
            component: './Order/AllOrder',
            title: '订单一览表',
          },
        ],
      },
      {
        path: '/inv',
        name: '仓库信息',
        routes: [
          {
            path: '/inv/stock',
            component: './Inventory/Stock',
            title: 'U9库存',
          },
          {
            path: '/inv/material',
            component: './Inventory/Material',
            title: '料品信息',
          },
        ],
      },
      {
        path: '/report',
        name: '报表',
        routes: [
          {
            path: '/report/dayPlans',
            component: './Report/DayPlans',
            title: '生产日计划',
          },
          {
            path: '/report/planByMaterial',
            component: './Report/PlanByMaterial',
            title: '生产计划汇总',
          },
          {
            path: '/report/trackOweMaterial',
            component: './Report/TrackOweMaterial',
            title: '欠料跟踪',
          },
          {
            path: '/report/productionProcessSchedule',
            component: './Report/ProductionProcessSchedule',
            title: '冲压生产报工报表',
          },
          {
            path: '/report/orderChangeCount',
            component: './Report/OrderChangeCount',
            title: '订单变更统计',
          },
          {
            path: '/report/orderComplete',
            component: './Report/OrderComplete',
            title: '齐套分析',
          },
          {
            path: '/report/stampingReport',
            component: './Report/StampingReport',
            title: '冲压车间进度表',
          },
          {
            path: '/report/washReport',
            component: './Report/WashReport',
            title: '清洗车间进度表',
          },
          {
            path: '/report/materialRequire',
            component: './Report/MaterialRequire',
            title: '物料需求计划',
          },
          {
            path: '/report/u9MoFinish',
            component: './Report/U9MoFinish',
            title: '完工单列表',
          },
          {
            path: '/report/noPlanMo',
            component: './Report/NoPlanMo',
            title: '未排产完工单',
          },
          {
            path: '/report/dayReport',
            component: './Report/DayReport',
            title: '日报',
          }
        ],
      },
    ],
  },
];
