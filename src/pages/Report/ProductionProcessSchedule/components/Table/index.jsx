import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, Space } from 'suid';
import { constants, getTimeFilter } from '@/utils';

const { PROJECT_PATH } = constants;

@connect(({ productionProcessSchedule, loading }) => ({ productionProcessSchedule, loading }))
class Table extends Component {
  state = {
    selectedRowKeys: [],
  };

  reloadData = () => {
    const { productionProcessSchedule } = this.props;
    const { currPRowData } = productionProcessSchedule;
    if (currPRowData) {
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

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { productionProcessSchedule } = this.props;
    const { currPRowData, dynamicCol } = productionProcessSchedule;

    const columns = [
      {
        title: '工单号',
        dataIndex: 'productOrder',
        width: 100,
        required: true,
      },
      {
        title: '报工日期',
        dataIndex: 'productionDate',
        width: 100,
        required: true,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 100,
        required: true,
      },
      {
        title: '料名',
        dataIndex: 'materialName',
        width: 100,
        required: true,
      },
      {
        title: '规格',
        dataIndex: 'materialSpec',
        width: 100,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();

    return {
      bordered: false,
      showSearch: false,
      refreshButton: 'empty',
      cascadeParams: {
        filters: filters.concat({
          fieldName: 'materialCode',
          operator: 'EQ',
          value: currPRowData && currPRowData.materialCode,
        }),
      },
      selectedRowKeys,
      onSelectRow: selectedKeys => {
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = [];
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns: columns.concat(dynamicCol),
      remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProductionProcessSchedule/findByOrder`,
      },
    };
  };

  render() {
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
      </>
    );
  }
}

export default Table;
