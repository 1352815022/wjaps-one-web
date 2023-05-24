import React, { Component } from 'react';
import { ExtTable, Space } from 'suid';
import { Button,DatePicker } from 'antd';
import { constants } from '@/utils';
const { PROJECT_PATH } = constants;
class NoPlanMo extends Component {
  state = {
    dateFilter: null
  }

  getTableFilters = () => {
    const { dateFilter } = this.state;
    const filters = [];
    if (dateFilter) {
      filters.push({
        fieldName: 'finishDate',
        operator: 'EQ',
        fieldType: 'date',
        value: dateFilter,
      });
    }
    return filters;
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };
  onDateChange = data => {
    if (data !== null) {
      const date = data.format('YYYY-MM-DD');
      this.setState({
        dateFilter: date,
      });
    } else {
      this.setState({
        dateFilter: null,
      });
    }
  };
  getExtableProps = () => {
    const columns = [
      {
        title: '工单号',
        dataIndex: 'orderNo',
        width: 300,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 300,
      },
      {
        title: '名称',
        dataIndex: 'materialName',
        width: 300,
      },
      {
        title: '完工日期',
        dataIndex: 'finishDate',
        width: 180,
      }, 
     {
        title: '完工数',
        dataIndex: 'finishQty',
        width: 180,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
        <Button onClick={this.refresh}>刷新</Button>
        日期{' '}: <DatePicker onChange={item => this.onDateChange(item)} format="YYYY-MM-DD" />
        </Space>
      )

      
    };
    const filters = this.getTableFilters()
    return {
      columns,
      toolBar: toolBarProps,
      remotePaging: true,
      sort: {
        field: { finishDate: 'desc' },
      },
      searchProperties: ['orderNo'],
      searchPlaceHolder: '工单号',
      cascadeParams: {
        filters,
      },
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'GET',
        url: `${PROJECT_PATH}/u9MoFinish/findNoPlan`
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default NoPlanMo;
