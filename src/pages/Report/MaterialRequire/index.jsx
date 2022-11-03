import React, { Component, Fragment } from 'react';
import { ExtTable, utils, ComboList } from 'suid';
import { Button, Input, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { constants } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { request } = utils;
const startFormat = 'YYYY-MM-DD';
const endFormat = 'YYYY-MM-DD';
const { PROJECT_PATH, SEARCH_DATE_PERIOD } = constants;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;
@connect(({ MaterialRequire, loading }) => ({ MaterialRequire, loading }))
class MaterialRequire extends Component {
  constructor(props) {
    super(props);
    this.getDynamicCols(defaultViewDate);
  }

  state = {
    currentViewDate: defaultViewDate,
    viewDateData,
    cols: []
  };

  refresh = () => {
    if (this.tableRef) {
      // this.setState
      this.tableRef.remoteDataRefresh();
    }
  };

  handleExport = () => {
    // console.log(this.tableRef);
    this.tableRef.extTool.exportData();
  };

  getDynamicCols = currentViewDate => {
    const currentDate = moment();
    const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
    let dateRange;
   
    switch (searchDateType) {
      case SEARCH_DATE_PERIOD.THIS_MONTH.name:
        dateRange = {
          effectiveFrom: currentDate.startOf('month').format(startFormat),
          effectiveTo: currentDate.endOf('month').format(endFormat),
        };
        break;
      case SEARCH_DATE_PERIOD.THIS_WEEK.name:
        dateRange = {
          effectiveFrom: currentDate.startOf('week').format(startFormat),
          effectiveTo: currentDate.endOf('week').format(endFormat),
        };
        break;
      case SEARCH_DATE_PERIOD.TODAY.name:
        dateRange = {
          effectiveFrom: currentDate.format(startFormat),
          effectiveTo: currentDate.format(startFormat),
        };
        break;
      case SEARCH_DATE_PERIOD.PERIOD.name:
        dateRange = {
          effectiveFrom: moment(startTime).format(startFormat),
          effectiveTo: moment(endTime).format(endFormat),
        };
        break; 
        case SEARCH_DATE_PERIOD.NONE.name:
             //默认当天
          dateRange = {
            effectiveFrom: currentDate.format(startFormat),
            effectiveTo: currentDate.format(startFormat),
          };
        break;
      default:
         //默认当天
         dateRange = {
          effectiveFrom: currentDate.format(startFormat),
          effectiveTo: currentDate.format(startFormat),
        };
        break;
    }
    request.post(`${PROJECT_PATH}/apsReport/getCols`, dateRange).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ cols: data });
      } else {
        message.error('获取列数据异常，请联系管理员');
      }
    });
  };

  getTableFilters = () => {
    const {
      currentViewDate,
      orderNoFilter,
      materialCodeFilter,
      materialNameFilter,
      materialSpecFilter,
    } = this.state;
    const filters = [];
    const currentDate = moment();
    const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
    if (orderNoFilter) {
      filters.push({
        fieldName: 'orderNo',
        operator: 'LK',
        fieldType: 'string',
        value: orderNoFilter,
      });
    }
    if (materialCodeFilter) {
      filters.push({
        fieldName: 'materialCode',
        operator: 'LK',
        fieldType: 'string',
        value: materialCodeFilter,
      });
    }
    if (materialNameFilter) {
      filters.push({
        fieldName: 'materialName',
        operator: 'LK',
        fieldType: 'string',
        value: materialNameFilter,
      });
    }
    if (materialSpecFilter) {
      filters.push({
        fieldName: 'materialSpec',
        operator: 'LK',
        fieldType: 'string',
        value: materialSpecFilter,
      });
    }
    switch (searchDateType) {
      case SEARCH_DATE_PERIOD.THIS_MONTH.name:
        filters.push({
          fieldName: 'planDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('month').format(startFormat),
        });
        filters.push({
          fieldName: 'planDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('month').format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.THIS_WEEK.name:
        filters.push({
          fieldName: 'planDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('week').format(startFormat),
        });
        filters.push({
          fieldName: 'planDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('week').format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.TODAY.name:
        filters.push({
          fieldName: 'planDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.format(startFormat),
        });
        filters.push({
          fieldName: 'planDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.PERIOD.name:
        filters.push({
          fieldName: 'planDate',
          operator: 'GE',
          fieldType: 'date',
          value: moment(startTime).format(startFormat),
        });
        filters.push({
          fieldName: 'planDate',
          operator: 'LE',
          fieldType: 'date',
          value: moment(endTime).format(endFormat),
        });
        break;
      default:
        break;
    }
    return filters;
  };

  handlerFilterDate = currentViewDate => {
    this.setState(
      {
        currentViewDate,
      },
      this.getDynamicCols(currentViewDate),
    );
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '需求分类号',
        dataIndex: 'orderNo',
        width: 160,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '物料规格',
        dataIndex: 'materialSpec',
        width: 200,
      },
      {
        title: '采购单号',
        dataIndex: 'po',
        width: 100,
      }
    ];
    const toolBarProps = {
      layout: { leftSpan: 3, rightSpan: 21 },
      left: (
        <Fragment>
          <Button style={{ marginRight: '8px' }} onClick={this.refresh}>
            刷新
          </Button>
          <Button onClick={this.handleExport}>导出</Button>
        </Fragment>
      ),
      right: (
        <Fragment>
       
          需求分类号{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ orderNoFilter: event.target.value })}
          />
          物料编码{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ materialCodeFilter: event.target.value })}
          />
          物料名称{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ materialNameFilter: event.target.value })}
          />
          物料规格{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ materialSpecFilter: event.target.value })}
          />
        
          <FilterDate
            title="订单日期过滤"
            currentViewType={this.state.currentViewDate}
            viewTypeData={this.state.viewDateData}
            onAction={this.handlerFilterDate}
          />
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns: columns.concat(this.state.cols),
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      remotePaging: false,
      exportData: true,
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsReport/requireByMaterial`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default MaterialRequire;
