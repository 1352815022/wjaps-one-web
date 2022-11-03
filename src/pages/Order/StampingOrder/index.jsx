import React, { Component, Fragment } from 'react';
import { ExtTable, ScopeDatePicker } from 'suid';
import { Button, message } from 'antd';
import { constants, exportXlsx } from '@/utils';

const { PROJECT_PATH } = constants;

class StampingOrder extends Component {
  state = {
    dataSource: [],
    dateRange: {
      effectiveFrom: undefined,
      effectiveTo: undefined,
    },
  };

  refresh = () => {
    const { dateRange } = this.state;
    if (!(dateRange.effectiveFrom && dateRange.effectiveTo)) {
      message.error('请选择日期范围后再查询！', 5);
      return;
    }
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  export = () => {
    const { dataSource } = this.state;
    if (dataSource && dataSource.length > 0) {
      exportXlsx(
        '冲压车间订单',
        [
          '料号',
          '料名',
          '规格',
          '拆分层级',
          '订单数量',
          '耗损比例',
          '生产欠数',
          '生产工单数',
          'SCM交期',
          'U9库存',
        ],
        dataSource,
      );
    } else {
      message.destroy();
      message.info('没找到数据,请点击刷新后重试！');
    }
  };

  handleDateChange = values => {
    const { dateRange } = this.state;
    const [effectiveFrom, effectiveTo] = values;
    dateRange.effectiveFrom = effectiveFrom;
    dateRange.effectiveTo = effectiveTo;

    this.setState(dateRange);
  };

  getExtableProps = () => {
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
        width: 280,
      },
      {
        title: '拆分层级',
        dataIndex: 'level',
        width: 100,
      },
      {
        title: '订单数量',
        dataIndex: 'orderQty',
        width: 100,
      },
      {
        title: '耗损比例',
        dataIndex: 'scrap',
        width: 100,
      },
      {
        title: '生产欠数',
        dataIndex: 'produceOweQty',
        width: 100,
      },
      {
        title: '生产工单数',
        dataIndex: 'produceQty',
        width: 100,
      },
      {
        title: 'SCM交期',
        dataIndex: 'scmDelivery',
        width: 100,
      },
      {
        title: 'U9库存',
        dataIndex: 'stockQty',
        width: 100,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <ScopeDatePicker
            allowClear="true"
            format="YYYY-MM-DD hh:mm:ss"
            style={{ marginRight: 6 }}
            onChange={this.handleDateChange}
          />
          <Button onClick={this.refresh} style={{ marginRight: 6 }}>
            查询
          </Button>
          <Button onClick={this.export}>导出</Button>
        </Fragment>
      ),
    };

    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: false,
      searchProperties: ['materialCode', 'materialName'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      rowKey: 'materialCode',
      refreshButton: 'empty',

      store: {
        params: this.state.dateRange,
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrder/getStampingOrder`,
        loaded: res => {
          this.setState({ dataSource: res.data });
        },
        autoLoad: false,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default StampingOrder;
