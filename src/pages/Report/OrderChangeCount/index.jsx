import React, { Component, Fragment } from 'react';
import { ExtTable } from 'suid';
import { Button, Input,DatePicker } from 'antd';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

class OrderChangeCount extends Component {
  state = {
    orderNoFilter: null,
    startDateFilter: null,
    endDateFilter: null,
    materialCodeFilter:null,
    materialNameFilter:null,

    
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getTableFilters = () => {
    const { orderNoFilter, startDateFilter,endDateFilter,materialCodeFilter,materialNameFilter } = this.state;
    const filters = {
      startDate: '',
      endDate:'',
      orderNo: '',
      materialCode:'',
      materialName:''

    };
    if (orderNoFilter) {
      filters.orderNo = orderNoFilter;
    }
    if (startDateFilter) {
      filters.startDate = startDateFilter;
    }
    if (endDateFilter) {
      filters.endDate = endDateFilter;
    }
    if (materialCodeFilter) {
      filters.materialCode = materialCodeFilter;
    }
    if (materialNameFilter) {
      filters.materialName = materialNameFilter;
    }
    return filters;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '需求分类号',
        dataIndex: 'orderNo',
        width: 200,
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
           开始日期（往后7天为区间）：{' '}
           <DatePicker onChange={item => {this.setState({startDateFilter:item.format('YYYY-MM-DD')})}} format="YYYY-MM-DD" />
          
          需求分类号：{' '}
          <Input
            placeholder="输入需求分类号进行过滤"
            allowClear
            style={{ width: '100px' }}
            onChange={e => {
              this.setState({ orderNoFilter: e.target.value });
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
    const filters = this.getTableFilters();

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
        url: `${PROJECT_PATH}/scmXbDelivery/findChange`,
        params: this.getTableFilters(),
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default OrderChangeCount;
