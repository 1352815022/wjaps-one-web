import React, { Component } from 'react';
import { ExtTable } from 'suid';
import { Button } from 'antd';
import { constants } from '@/utils';
const { PROJECT_PATH } = constants;
class DayReport extends Component {
  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        width: 120,
      },
      {
        title: '计划数',
        dataIndex: 'planQty',
        width: 180,
      },
      {
        title: '完工数',
        dataIndex: 'finishQty',
        width: 180,
      },
      {
        title: '未排数',
        dataIndex: 'noPlanQty',
        width: 180,
      },{
        title: '达成率',
        dataIndex: 'planRate',
        width: 180,
      }
    ];
    const toolBarProps = {
      left: <Button onClick={this.refresh}>刷新</Button>,
    };

    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url:`${PROJECT_PATH}/apsDayReport/findByPage`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default DayReport;
