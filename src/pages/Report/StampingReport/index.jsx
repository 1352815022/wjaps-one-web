import React, { Component, Fragment } from 'react';
import { ExtTable } from 'suid';
import { Button } from 'antd';
import { constants, getTimeFilter } from '@/utils';

import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH, SEARCH_DATE_PERIOD } = constants;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

class StampingReport extends Component {
  state = {
    currentViewDate: defaultViewDate,
    viewDateData,
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getTableFilters = () => {
    const { currentViewDate } = this.state;
    let filters = [];
    filters = filters.concat(getTimeFilter('productionDate', currentViewDate));
    return filters;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '工单号',
        dataIndex: 'orderNo',
        width: 120,
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 180,
      },
      {
        title: '班组',
        dataIndex: 'lineName',
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
        dataIndex: 'materialSpec',
        width: 180,
      },
      {
        title: '订单数量',
        dataIndex: 'orderQty',
        width: 180,
      },
      {
        title: '首工序完成数',
        dataIndex: 'firstProcessQty',
        width: 180,
      },
      {
        title: '尾工序完成数',
        dataIndex: 'lastProcessQty',
        width: 180,
      },
      {
        title: '库存数量',
        dataIndex: 'inStockQty',
        width: 180,
      },
      {
        title: '生产日期',
        dataIndex: 'productionDate',
        width: 180,
      },
      {
        title: 'SCM交期',
        dataIndex: 'deliveryDate',
        width: 180,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.refresh}>刷新</Button>
          <Button onClick={() => this.tableRef.extTool.exportData()}>导出</Button>
        </Fragment>
      ),
      right: (
        <Fragment>
          <FilterDate
            title="订单日期过滤"
            currentViewType={this.state.currentViewDate}
            viewTypeData={this.state.viewDateData}
            onAction={currentViewDate => {
              this.setState({ currentViewDate }, this.refresh());
            }}
          />
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: false,
      searchProperties: ['orderNo', 'workGroupName', 'lineName', 'materialCode', 'materialName'],
      cascadeParams: {
        filters,
      },
      exportData: true,
      rowKey: 'orderNo',
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProductionProcessSchedule/findByOrderReport`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default StampingReport;
