import React, { Component, Fragment } from 'react';
import { ExtTable } from 'suid';
import { Button, Input } from 'antd';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

class OrderChangeCount extends Component {
  state = {
    orderNoFilter: null,
    poFilter: null,
    materialCodeFilter: null,
    materialNameFilter: null,
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getFilters = () => {
    const filters = [];
    console.log(this.state);
    if (this.state.orderNoFilter) {
      filters.push({
        fieldName: 'a.order_no',
        operator: 'LK',
        fieldType: 'string',
        value: this.state.orderNoFilter,
      });
    }
    if (this.state.poFilter) {
      filters.push({
        fieldName: 'a.po',
        operator: 'LK',
        fieldType: 'string',
        value: this.state.poFilter,
      });
    }
    if (this.state.materialCodeFilter) {
      filters.push({
        fieldName: 'a.material_code',
        operator: 'LK',
        fieldType: 'string',
        value: this.state.materialCodeFilter,
      });
    }
    if (this.state.materialNameFilter) {
      filters.push({
        fieldName: 'a.material_name',
        operator: 'LK',
        fieldType: 'string',
        value: this.state.materialNameFilter,
      });
    }
    return filters;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '需求分类号',
        dataIndex: 'orderNo',
        width: 100,
      },
      {
        title: '采购单号',
        dataIndex: 'po',
        width: 180,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 180,
      },
      {
        title: '料名',
        dataIndex: 'materialName',
        width: 180,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 180,
      },
      {
        title: '车间',
        dataIndex: 'apsOrderWorkGroupName',
        width: 180,
      },
      {
        title: '班组',
        dataIndex: 'apsOrderWorkLineName',
        width: 180,
      },
      {
        title: '变更前数量',
        dataIndex: 'deliveryOldQty',
        width: 180,
        render: (_, record) => {
          if (record.changeQtyFlag) {
            return record.deliveryOldQty;
          }
          return record.deliveryQty;
        },
      },
      {
        title: '变更后数量',
        dataIndex: 'deliveryQty',
        width: 180,
        render: (_, record) => {
          if (record.changeQtyFlag) {
            return <span style={{ color: 'red' }}>{record.deliveryQty}</span>;
          }
          return '无变更';
        },
      },
      {
        title: '原交期',
        dataIndex: 'deliveryOldStartDate',
        width: 180,
        render: (_, record) => {
          if (record.changeDateFlag) {
            return record.deliveryOldStartDate;
          }
          return record.deliveryStartDate;
        },
      },
      {
        title: '现交期',
        dataIndex: 'deliveryStartDate',
        width: 180,
        render: (_, record) => {
          if (record.changeDateFlag) {
            return <span style={{ color: 'red' }}>{record.deliveryStartDate}</span>;
          }
          return '无变更';
        },
      },
      {
        title: '订单状态',
        dataIndex: 'apsOrderStatusRemark',
        width: 180,
      },
      {
        title: '客户',
        dataIndex: 'companyName',
        width: 180,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 8, rightSpan: 16 },
      left: <Button onClick={this.refresh}>刷新</Button>,
      right: (
        <Fragment>
          需求分类号：{' '}
          <Input
            placeholder="输入需求分类号进行过滤"
            allowClear
            style={{ width: '100px' }}
            onChange={e => {
              this.setState({ orderNoFilter: e.target.value });
            }}
          />
          PO：{' '}
          <Input
            placeholder="输入PO号进行过滤"
            allowClear
            style={{ width: '100px' }}
            onChange={e => {
              this.setState({ poFilter: e.target.value });
            }}
          />
          料号：{' '}
          <Input
            placeholder="输入料号进行过滤"
            allowClear
            style={{ width: '100px' }}
            onChange={e => {
              this.setState({ materialCodeFilter: e.target.value });
            }}
          />
          料名：{' '}
          <Input
            placeholder="输入料名进行过滤"
            allowClear
            style={{ width: '100px' }}
            onChange={e => {
              this.setState({ materialNameFilter: e.target.value });
            }}
          />
        </Fragment>
      ),
    };
    const filters = this.getFilters();

    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: true,
      showSearch: false,
      cascadeParams: {
        filters,
      },
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/scmXbDelivery/findByPage`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default OrderChangeCount;
