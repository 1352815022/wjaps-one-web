import React, { Component, Fragment } from 'react';
import { ExtTable } from 'suid';
import { Button } from 'antd';
import { constants, getTimeFilter } from '@/utils';

import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH, SEARCH_DATE_PERIOD } = constants;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

class WashReport extends Component {
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
    filters = filters.concat(getTimeFilter('date', currentViewDate));
    return filters;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '报工日期',
        dataIndex: 'reportDate',
        width: 120,
      },
      {
        title: '单号',
        dataIndex: 'orderNo',
        width: 180,
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 100,
      },
      {
        title: '班组',
        dataIndex: 'workLineName',
        width: 100,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '料名',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '规格',
        dataIndex: 'materialSpec',
        width: 100,
      },
      {
        title: '订单数量',
        dataIndex: 'orderQty',
        width: 100,
      },
      {
        title: '排产数量',
        dataIndex: 'planQty',
        width: 100,
      },
      {
        title: 'SCM交期',
        dataIndex: 'deliveryDate',
        width: 100,
      },
      {
        title: '清洗报工数',
        dataIndex: 'washReportQty',
        width: 100,
      },
      {
        title: '喷粉报工数',
        dataIndex: 'powderReportQty',
        width: 100,
      },
      {
        title: '入库数量',
        dataIndex: 'inStockQty',
        width: 100,
      },
      {
        title: '上月期末数',
        dataIndex: 'lastQty',
        width: 100,
      },
      {
        title: '喷粉类型',
        dataIndex: 'powderModel',
        width: 100,
      },
      {
        title: '单件喷粉面积',
        dataIndex: 'powderArea',
        width: 100,
      },
      {
        title: '单件清洗面积',
        dataIndex: 'washArea',
        width: 100,
      },
      {
        title: '总喷粉面积',
        dataIndex: 'sumPowderArea',
        width: 100,
      },
      {
        title: '总清洗面积',
        dataIndex: 'sumWashArea',
        width: 100,
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
      searchProperties: [
        'orderNo',
        'workGroupName',
        'workLineName',
        'materialCode',
        'materialName',
      ],
      cascadeParams: {
        filters,
      },
      exportData: true,
      rowKey: 'orderNo',
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProductionProcessSchedule/findWashByorder`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default WashReport;
