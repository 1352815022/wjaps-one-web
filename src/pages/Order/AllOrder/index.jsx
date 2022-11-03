import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ComboList, ExtTable, utils } from 'suid';
import moment from 'moment';
import { Button, message } from 'antd';
import { constants, exportXlsx } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { request } = utils;
const dateFormat = 'YYYY-MM-DD';
// const endFormat = 'YYYY-MM-DD';
const { PROJECT_PATH, SEARCH_DATE_PERIOD, ORDER_TYPE } = constants;

@withRouter
@connect(({ allOrder, loading }) => ({ allOrder, loading }))
class AllOrder extends Component {
  state = {
    orderTypeFilter: null,
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getTableFilters = () => {
    const { allOrder } = this.props;
    const { currentViewDate } = allOrder;
    const filters = [];
    const currentDate = moment();
    const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
    const { orderTypeFilter } = this.state;
    if (orderTypeFilter) {
      filters.push({
        fieldName: 'type',
        operator: 'EQ',
        fieldType: 'string',
        value: orderTypeFilter,
      });
    }

    switch (searchDateType) {
      case SEARCH_DATE_PERIOD.THIS_MONTH.name:
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('month').format(dateFormat),
        });
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('month').format(dateFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.THIS_WEEK.name:
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('week').format(dateFormat),
        });
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('week').format(dateFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.TODAY.name:
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.format(dateFormat),
        });
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.format(dateFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.PERIOD.name:
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'GE',
          fieldType: 'date',
          value: moment(startTime).format(dateFormat),
        });
        filters.push({
          fieldName: 'deliveryStartDate',
          operator: 'LE',
          fieldType: 'date',
          value: moment(endTime).format(dateFormat),
        });
        break;
      default:
        break;
    }
    return filters;
  };

  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    console.log(currentViewDate);
    dispatch({
      type: 'allOrder/updateState',
      payload: {
        currentViewDate,
      },
    });
  };

  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/apsOrder/exportAllOrder`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '订单一览表',
          [
            '订单号',
            '采购单号',
            '下单日期',
            '料号',
            '料名',
            '料规格',
            '客户名称',
            '类型',
            '状态',
            'U9状态',
            '订单数量',
            '生产数量',
            '欠入库数',
            '已排数量',
            '未排数量',
            '计划完工日期',
            '开始送货日期',
            '投料日期',
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };

  getExtableProps = () => {
    const { allOrder } = this.props;
    const { currentViewDate, viewDateData } = allOrder;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'orderNo',
        width: 230,
      },
      {
        title: '采购单号',
        dataIndex: 'poNo',
        width: 140,
        required: true,
      },
      {
        title: '单据类型',
        dataIndex: 'typeRemark',
        width: 120,
        required: true,
      },
      {
        title: '工单日期',
        dataIndex: 'orderDate',
        width: 120,
        required: true,
      },
      {
        title: '料号',
        dataIndex: 'materialCode',
        width: 120,
        required: true,
      },
      {
        title: '料名',
        dataIndex: 'materialName',
        width: 120,
        required: true,
      },
      {
        title: '规格',
        dataIndex: 'materialSpec',
        width: 120,
        required: true,
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        width: 120,
        required: true,
      },
      {
        title: '状态',
        dataIndex: 'statusRemark',
        width: 120,
        required: true,
      },
      {
        title: 'U9状态',
        dataIndex: 'u9StatusRemark',
        width: 120,
        required: true,
      },
      {
        title: '订单数量',
        dataIndex: 'orderQty',
        width: 100,
        required: true,
      },
      {
        title: '生产数量',
        dataIndex: 'produceQty',
        width: 100,
        required: true,
      },
      {
        title: '欠入库数',
        dataIndex: 'oweQty',
        width: 100,
        required: true,
      },
      {
        title: '已排数量',
        dataIndex: 'totalPlanQty',
        width: 100,
        required: true,
      },
      {
        title: '未排数量',
        dataIndex: 'noPlanQty',
        width: 100,
        required: true,
      },
      {
        title: '计划完工日期',
        dataIndex: 'planFinishDate',
        width: 120,
        required: true,
      },
      {
        title: '开始送货日期',
        dataIndex: 'deliveryStartDate',
        width: 120,
        required: true,
      },
      {
        title: '最后送货日期',
        dataIndex: 'deliveryEndDate',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.refresh}>刷新</Button>
          <Button onClick={this.handlerExport}>导出</Button>
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
          <ComboList
            dataSource={ORDER_TYPE}
            style={{ width: 130 }}
            rowKey="code"
            reader={{
              name: 'name',
            }}
            allowClear
            showSearch={false}
            pagination={false}
            placeholder="单据类型"
            afterSelect={item => {
              this.setState({
                orderTypeFilter: item.code,
              });
            }}
          />
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();

    return {
      columns,
      toolBar: toolBarProps,
      sort: {
        field: { deliveryStartDate: 'desc' },
      },
      cascadeParams: {
        filters,
      },
      remotePaging: true,
      searchProperties: [
        'orderNo',
        'poNo',
        'materialCode',
        'materialName',
        'materialDesc',
        'customerName',
      ],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrder/findByPage`,
      },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default AllOrder;
