import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import { constants, getTimeFilter, getRangeDate, exportHandle } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH } = constants;

@connect(({ trackOweMaterial, loading }) => ({ trackOweMaterial, loading }))
class List extends Component {
  componentDidMount() {
    const { trackOweMaterial } = this.props;
    const { currentViewDate } = trackOweMaterial;
    this.getDynamicCols(currentViewDate);
  }

  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'trackOweMaterial/updateState',
      payload: {
        currentViewDate,
      },
    });
    this.getDynamicCols(currentViewDate);
    this.reloadData();
  };

  calcOweMaterial = () => {
    const { dispatch, trackOweMaterial } = this.props;
    const { currentViewDate } = trackOweMaterial;
    const dateRange = getRangeDate(currentViewDate);
    dispatch({
      type: 'trackOweMaterial/calcOweMaterial',
      payload: dateRange,
    });
  };

  getDynamicCols = currentViewDate => {
    const { dispatch } = this.props;
    const dateRange = getRangeDate(currentViewDate);

    dispatch({
      type: 'trackOweMaterial/getDynamicCols',
      payload: dateRange,
    }).then(res => {
      const { data } = res;
      dispatch({
        type: 'trackOweMaterial/updateState',
        payload: {
          dynamicCol: data,
        },
      });
      this.forceUpdate();
    });
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getTableFilters = () => {
    const { trackOweMaterial } = this.props;
    const { currentViewDate } = trackOweMaterial;
    let filters = [];
    filters = filters.concat(getTimeFilter('planDate', currentViewDate));
    return filters;
  };

  exportSummary = () => {
    const tableFilters = this.getTableFilters();
    exportHandle(
      '/apsReport/exportOweSummary',
      {
        filters: tableFilters,
        sortOrders: [{ property: 'planDate', direction: 'ASC' }],
      },
      '欠料汇总',
    );
  };

  exportPlan = () => {
    const tableFilters = this.getTableFilters();
    exportHandle(
      '/apsReport/exportOwePlan',
      {
        filters: tableFilters,
        sortOrders: [{ property: 'planDate', direction: 'ASC' }],
      },
      '欠料明细',
    );
  };

  getExtableProps = () => {
    const { trackOweMaterial, dispatch } = this.props;
    const { dynamicCol, currentViewDate, viewDateData } = trackOweMaterial;

    const columns = [
      {
        title: '类型',
        dataIndex: 'materialType',
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
        title: '库存数量',
        dataIndex: 'stockQty',
        width: 100,
      },
      {
        title: '已领数量',
        dataIndex: 'pullQty',
        width: 100,
      },
      {
        title: '需求数量',
        dataIndex: 'requireQty',
        width: 100,
      },
      {
        title: '暂收数量',
        dataIndex: 'tempReceiveQty',
        width: 100,
      },
      {
        title: '超欠数量',
        dataIndex: 'beyondQty',
        width: 100,
      },
      {
        title: '请购数量',
        dataIndex: 'poQty',
        width: 100,
      },
      {
        title: '欠料日期',
        dataIndex: 'oweDate',
        width: 100,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.calcOweMaterial}>计算欠料</Button>
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
      remotePaging: true,
      searchProperties: ['materialCode', 'materialType', 'materialName', 'materialSpec'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'trackOweMaterial/updateState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsReport/findOweSummaryByPage`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default List;
