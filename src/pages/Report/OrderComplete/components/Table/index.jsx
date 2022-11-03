import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ExtTable, Space } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@connect(({ orderComplete, loading }) => ({ orderComplete, loading }))
class Table extends Component {
  reloadData = () => {
    const { orderComplete } = this.props;
    const { currPRowData } = orderComplete;
    if (currPRowData) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerExport = () => {
    this.tableRef.extTool.exportData();
  };

  getExtableProps = () => {
    const { orderComplete } = this.props;
    const { currPRowData } = orderComplete;

    const columns = [
      {
        title: '工单号',
        dataIndex: 'productOrder',
        width: '20%',
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: '15%',
      },
      {
        title: '料名',
        dataIndex: 'materialName',
        width: '15%',
      },
      {
        title: '需求数',
        dataIndex: 'requireQty',
        width: '10%',
      },
      {
        title: '完成数',
        dataIndex: 'finishQty',
        width: '10%',
      },
      {
        title: '齐套率',
        dataIndex: 'completePercent',
        width: '10%',
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.handlerExport}>导出</Button>
        </Space>
      ),
    };
    return {
      bordered: false,
      searchProperties: ['productOrder', 'materialCode', 'materialName', 'productModel'],
      searchPlaceHolder: '输入 工单号/料品信息/产品型号 进行过滤',
      refreshButton: 'empty',
      cascadeParams: {
        filters: [
          {
            fieldName: 'parentId',
            operator: 'EQ',
            value: currPRowData && currPRowData.id,
          },
        ],
      },
      columns,
      remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      exportData: queryParams => {
        return {
          url: `${PROJECT_PATH}/apsOrderDetailComplete/export`,
          data: queryParams,
          method: 'POST',
          responseType: 'blob',
        };
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrderDetailComplete/findByPage`,
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
