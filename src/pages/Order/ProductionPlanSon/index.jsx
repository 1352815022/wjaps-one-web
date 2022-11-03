import React, { Component, Fragment } from 'react';
import { ExtTable, utils } from 'suid';
import { Button, message, Spin } from 'antd';

import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;

class ProductionPlanSon extends Component {
  constructor() {
    super();
    request.get(`${PROJECT_PATH}/apsOrderPlan/getCols`).then(r => {
      // if (r.success)
      const { success, data, message: msg } = r;
      if (success) {
        this.setState({
          dynamicCol: data,
        });
      } else {
        message.error(msg);
      }
      console.log(r);
    });
  }

  state = {
    dynamicCol: [],
    loading: false,
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  exportHandle = () => {
    this.setState({ loading: true });
    request
      .post(`${PROJECT_PATH}/apsOrderPlanSon/export`, {}, { responseType: 'blob' })
      .then(res => {
        const { success, data, message: msg } = res;
        if (success) {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = '子件生产计划.xlsx';
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        } else {
          message.error(msg);
        }
        this.setState({ loading: false });
      });
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '组件单号',
        dataIndex: 'componentOrderNo',
        width: 120,
      },
      {
        title: '子件单号',
        dataIndex: 'u9No',
        width: 100,
      },
      {
        title: '批次号',
        dataIndex: 'planNum',
        width: 100,
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 100,
      },
      {
        title: '生产线',
        dataIndex: 'lineName',
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
        title: '交期',
        dataIndex: 'scmDeliveryDate',
        width: 100,
      },
      {
        title: '计划数量',
        dataIndex: 'planQty',
        width: 100,
      },
      {
        title: '待排数量',
        dataIndex: 'awaitQty',
        width: 100,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.refresh}>刷新</Button>
          <Button onClick={this.exportHandle}>导出</Button>
        </Fragment>
      ),
    };

    return {
      columns: columns.concat(this.state.dynamicCol),
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrderPlanSon/find`,
      },
    };
  };

  render() {
    return (
      <Spin spinning={this.state.loading} delay={500}>
        <ExtTable {...this.getExtableProps()} />
      </Spin>
    );
  }
}

export default ProductionPlanSon;
