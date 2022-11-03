import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, Space } from 'suid';
import { constants, getTimeFilter } from '@/utils';

const { PROJECT_PATH } = constants;

@connect(({ trackOweMaterial, loading }) => ({ trackOweMaterial, loading }))
class Table extends Component {
  state = {
    selectedRowKeys: [],
  };

  reloadData = () => {
    const { trackOweMaterial } = this.props;
    const { currPRowData } = trackOweMaterial;
    if (currPRowData) {
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

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { trackOweMaterial } = this.props;
    const { currPRowData, dynamicCol } = trackOweMaterial;

    const columns = [
      {
        title: '工单号',
        dataIndex: 'orderNo',
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
      {
        title: '排产数量',
        dataIndex: 'planQty',
        width: 100,
        required: true,
      },
      {
        title: '需求数量',
        dataIndex: 'requireQty',
        width: 100,
        required: true,
      },
      {
        title: '已领数量',
        dataIndex: 'pullQty',
        width: 100,
        required: true,
      },
      {
        title: '超欠数量',
        dataIndex: 'oweQty',
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
          fieldName: 'apsOweMaterialPlan.summaryId',
          operator: 'EQ',
          value: currPRowData && currPRowData.id,
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
        url: `${PROJECT_PATH}/apsReport/findOwePlanByPage`,
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
