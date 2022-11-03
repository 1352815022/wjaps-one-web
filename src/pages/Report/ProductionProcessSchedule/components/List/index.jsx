import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import { constants, getTimeFilter, exportHandle } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH } = constants;

@connect(({ productionProcessSchedule, loading }) => ({ productionProcessSchedule, loading }))
class List extends Component {
  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionProcessSchedule/updateState',
      payload: {
        currentViewDate,
      },
    });
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getTableFilters = () => {
    const { productionProcessSchedule } = this.props;
    const { currentViewDate } = productionProcessSchedule;
    let filters = [];
    filters = filters.concat(getTimeFilter('productionDate', currentViewDate));
    return filters;
  };

  exportSummary = () => {
    this.tableRef.extTool.exportData();
  };

  exportPlan = () => {
    const tableFilters = this.getTableFilters();
    exportHandle(
      '/apsProductionProcessSchedule/exportByOrder',
      {
        filters: tableFilters,
      },
      'MCAS按单工序报工',
    );
  };

  getExtableProps = () => {
    const { productionProcessSchedule, dispatch } = this.props;
    const { currentViewDate, viewDateData, dynamicCol } = productionProcessSchedule;

    const columns = [
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
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.exportSummary}>汇总导出</Button>
          <Button onClick={this.exportPlan}>明细导出</Button>
        </Fragment>
      ),
      right: (
        <Fragment>
          <FilterDate
            title="订单日期过滤"
            currentViewType={currentViewDate}
            viewTypeData={viewDateData}
            onAction={this.handlerFilterDate}
          />
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns: columns.concat(dynamicCol),
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      remotePaging: false,
      exportData: true,
      searchProperties: ['materialCode', 'materialName'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'productionProcessSchedule/updateState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProductionProcessSchedule/findByMaterial`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default List;
