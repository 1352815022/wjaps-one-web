import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@connect(({ orderComplete, loading }) => ({ orderComplete, loading }))
class List extends Component {
  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderComplete/updateState',
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

  handlerExport = () => {
    this.tableRef.extTool.exportData();
  };

  getExtableProps = () => {
    const { dispatch } = this.props;

    const columns = [
      {
        title: '需求分类号',
        dataIndex: 'orderNo',
        width: '20%',
      },
      {
        title: '产品型号',
        dataIndex: 'productModel',
        width: '15%',
      },
      {
        title: '公司名',
        dataIndex: 'company',
        width: '15%',
      },
      {
        title: '订单个数',
        dataIndex: 'orderNum',
        width: '15%',
      },
      {
        title: '订单齐套个数',
        dataIndex: 'completeNum',
        width: '15%',
      },
      {
        title: '齐套率',
        dataIndex: 'completePercent',
        width: '15%',
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.handlerExport}>汇总导出</Button>
        </Fragment>
      ),
    };
    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['orderNo', 'productModel', 'company'],
      searchPlaceHolder: '请输入 需求号/产品型号/公司名 进行查询',
      onTableRef: inst => (this.tableRef = inst),
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'orderComplete/updateState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      exportData: queryParams => {
        return {
          url: `${PROJECT_PATH}/apsOrderComplete/export`,
          data: queryParams,
          method: 'POST',
          responseType: 'blob',
        };
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrderComplete/findByPage`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default List;
