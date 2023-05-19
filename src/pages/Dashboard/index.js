import React, { Component } from 'react';
import { Icon, Menu, Layout } from 'antd';
import Link from 'umi/link';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import styles from './index.less';

const { Header, Content } = Layout;
const { SubMenu } = Menu;

const menuData = [
  {
    id: '1',
    name: '本地登录',
    path: '/user/login',
  },
  {
    id: '10',
    name: 'moduleName',
    children: [
      {
        id: '100',
        name: 'menuName',
        path: '/moduleName/demo',
      },
      {
        id: '101',
        name: '标准工序',
        path: '/basic/standardProcedure',
      },
      {
        id: '102',
        name: '标准工艺',
        path: '/basic/standardProcess',
      },
      {
        id: '103',
        name: '组织架构',
        path: '/basic/organize',
      },
      {
        id: '104',
        name: '组织工序',
        path: '/basic/orgProcess',
      },
      {
        id: '105',
        name: '生产计划排产',
        path: '/order/productionPlan',
      },
      {
        id: '106',
        name: '节假日配置',
        path: '/basic/holiday',
      },
      {
        id: '107',
        name: '上班日历配置',
        path: '/basic/workTimes',
      },
      {
        id: '107',
        name: '标准产能',
        path: '/basic/materialCapacity',
      },
      {
        id: '108',
        name: 'U9库存',
        path: '/inv/stock',
      },
      {
        id: '109',
        name: '预排订单信息',
        path: '/order/planInner',
      },
      {
        id: '110',
        name: '冲压车间订单',
        path: '/order/stampingOrder',
      },
      {
        id: '111',
        name: '委外计划',
        path: '/order/purchasePlan',
      },
       {
         id: '112',
         name: '物料需求分析',
         path: '/report/materialRequire',
       },
      {
        id: '113',
        name: '料品工艺',
        path: '/basic/materialProcess',
      },
      {
        id: '114',
        name: '订单预览总表',
        path: '/order/allOrder',
      },
      {
        id: '115',
        name: '生产日计划',
        path: '/report/dayPlans',
      },
      {
        id: '116',
        name: '生产计划汇总',
        path: '/report/planByMaterial',
      },
      {
        id: '117',
        name: '欠料跟踪',
        path: '/report/trackOweMaterial',
      },
      {
        id: '118',
        name: '冲压生产报工报表',
        path: '/report/productionProcessSchedule',
      },
      {
        id: '119',
        name: '料品信息',
        path: '/inv/material',
      },
      {
        id: '120',
        name: '订单变更统计',
        path: '/report/orderChangeCount',
      },
      {
        id: '121',
        name: '齐套分析',
        path: '/report/orderComplete',
      },
      {
        id: '122',
        name: '冲压车间进度表',
        path: '/report/stampingReport',
      },
      {
        id: '123',
        name: '清洗车间进度表',
        path: '/report/washReport',
      },
      {
        id: '124',
        name: '完工报告',
        path: '/report/u9MoFinish',
      },
      {
        id: '125',
        name: '未排产完工单',
        path: '/report/noPlanMo',
      },
      {
        id: '126',
        name: '日报',
        path: '/report/dayReport',
      }
    ],
  },
];

const getIcon = icon => {
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class Home extends Component {
  componentDidMount() {
    this.getNavMenuItems(menuData);
  }

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  getSubMenuTitle = item => {
    const { name } = item;
    return item.icon ? (
      <span>
        {getIcon(item.icon)}
        <span>{name}</span>
      </span>
    ) : (
      name
    );
  };

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu title={this.getSubMenuTitle(item)} key={item.id}>
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.id}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = item => {
    const { name } = item;
    const { location } = this.props;
    return (
      <Link to={item.path} replace={item.path === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  render() {
    return (
      <Layout className={cls(styles['main-box'])}>
        <Header className={cls('menu-header')}>应用路由列表</Header>
        <Content className={cls('menu-box')}>
          <ScrollBar>
            <Menu key="Menu" mode="inline" theme="light">
              {this.getNavMenuItems(menuData)}
            </Menu>
          </ScrollBar>
        </Content>
      </Layout>
    );
  }
}
