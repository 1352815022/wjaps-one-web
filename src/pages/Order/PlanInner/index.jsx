import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Input, message, Popconfirm } from 'antd';
import { ExtTable, ComboList,utils } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import OrderPlanModal from './OrderPlanModal';
import EditModal from './EditModal';
import styles from './index.less';
import { constants, getTimeFilter,exportXlsx } from '@/utils';
import FilterDate from '@/components/FilterDate';
import BatchOrderModal from '@/pages/Order/PlanInner/BatchOrderModal';
const { request } = utils;
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ planInner, loading }) => ({ planInner, loading }))
class PlanInner extends Component {
  static editData;

  static errorMsgs;

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.editData = {};
    this.errorMsgs = {};

    // 初始化车间
    dispatch({
      type: 'planInner/findOrgsByFilter',
      payload: {
        filters: [
          {
            fieldName: 'category',
            operator: 'EQ',
            value: 'WorkGroup',
          },
          {
            fieldName: 'frozen',
            operator: 'EQ',
            value: false,
          },
        ],
      },
    })
      .then(res => {
        const { data } = res;
        this.setState({
          workGroups: data,
        });
      })
      .then(() => {
        // 初始化班组
        dispatch({
          type: 'planInner/findOrgsByFilter',
          payload: {
            filters: [
              {
                fieldName: 'category',
                operator: 'EQ',
                value: 'Line',
              },
              {
                fieldName: 'frozen',
                operator: 'EQ',
                value: false,
              },
            ],
          },
        }).then(res => {
          const { data } = res;
          this.setState({
            workLines: data,
          });
        });
      });
  }

  state = {
    orderNoFilter: null,
    materialCodeFilter: null,
    materialNameFilter: null,
    materialSpecFilter: null,
    workGroups: [],
    workLines: [],
    statusFilter: null,
    u9StatusFilter: null,
    workGroupFilter: null,
    workLineFilter: null,
    statusOptions: [
      {
        code: 'NoRelease',
        name: '未下达',
      },
      {
        code: 'Released',
        name: '已下达',
      },
      {
        code: 'Release_Part',
        name: '部分下达',
      },
      {
        code: 'Completed',
        name: '已完成',
      },
      {
        code: 'Stop',
        name: '暂停',
      },
    ],
    u9StatusOptions: [
      {
        id: 1,
        code: 'Approved',
        name: '已核准',
      },
      {
        id: 2,
        code: 'Approving',
        name: '核准中',
      },
      {
        id: 3,
        code: 'Completed',
        name: '完工',
      },
      {
        id: 4,
        code: 'Create',
        name: '开立',
      },
      {
        id: 5,
        code: 'Working',
        name: '开工',
      },
    ],
  };

  reloadData = () => {
    this.tableRef.remoteDataRefresh();
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'calcSelectQty': {
        const { selectedRows } = this.tableRef.state;
        let orderQty = 0;

        for (let i = 0; i < selectedRows.length; i += 1) {
          orderQty += selectedRows[i].orderQty;
        }
        message.success(`选中的订单总量为：${orderQty}`);
        break;
      }

      case 'plan': {
        console.log(this.editData[row.id] || row);
        dispatch({
          type: 'planInner/updateState',
          payload: {
            orderPlanModalVisible: true,
            editData: row,
          },
        });
        break;
      }
      case 'edit':
        dispatch({
          type: 'planInner/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'split':
        dispatch({
          type: 'planInner/updateState',
          payload: {
            splitModalVisible: true,
            editData: row,
          },
        });
        break;
      case 'batchOrder': {
        const { selectedRows } = this.tableRef.state;

        if (selectedRows.length === 0) {
          message.error('请选择记录！');
          return;
        }
        dispatch({
          type: 'planInner/updateState',
          payload: {
            batchOrderModalVisible: true,
            editData: row,
          },
        });
        break;
      }
      default:
        break;
    }
  };

  handleSave = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'planInner/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'planInner/updateState',
          payload: {
            modalVisible: false,
            orderPlanModalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleOrderPlan = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'planInner/orderPlan',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'planInner/updateState',
          payload: {
            modalVisible: false,
            orderPlanModalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'planInner/updateState',
      payload: {
        modalVisible: false,
        orderPlanModalVisible: false,
        batchOrderModalVisible: false,
        editData: null,
      },
    });
  };

  /**
   * 批量排产
   * @param data
   */
  handleBatchPlan = data => {
    const { dispatch } = this.props;
    const { selectedRows } = this.tableRef.state;
    for (let i = 0; i < selectedRows.length; i += 1) {
      selectedRows[i].planQty = selectedRows[i].noPlanQty;
      selectedRows[i].workLineId = data.workLineId;
      selectedRows[i].workGroupId = data.workGroupId;
      selectedRows[i].workLineName = data.workLineName;
      selectedRows[i].workGroupName = data.workGroupName;
      selectedRows[i].planTypeCode = data.planTypeCode;
      selectedRows[i].planStartDate = data.planStartDate;
    }
    // console.log(selectedRows)
    dispatch({
      type: 'planInner/batchPlan',
      payload: selectedRows,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'planInner/updateState',
          payload: {
            batchOrderModalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handlerStatusChange = type => {
    const { dispatch } = this.props;
    const { selectedRows } = this.tableRef.state;
    if (selectedRows.length === 0) {
      message.error('请选择记录！');
      return;
    }
    for (let i = 0; i < selectedRows.length; i += 1) {
      selectedRows[i].status = type;
    }
    dispatch({
      type: 'planInner/changStatus',
      payload: selectedRows,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'planInner/updateState',
          payload: {
            batchOrderModalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'planInner/updateState',
      payload: {
        currentViewDate,
      },
    });
  };
  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/apsOrder/exportInnerOrder`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '预排订单信息',
          [
            '订单号',
            '车间',
            '班组',
            '下单日期',
            '产能',
            '物料编码',
            '物料名称',
            '物料规格',
            '客户名称',
            'APS状态',
            'U9状态',
            '订单数量',
            '生产数量',
            '欠入库数',
            '已排数量',
            '未排数量',
            '计划开工日期',
            '计划完工日期',
            '开始送货日期',
            '最后送货日期',
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };
  getTableFilters = () => {
    const { planInner } = this.props;
    const { currentViewDate } = planInner;
    const {
      statusFilter,
      u9StatusFilter,
      workGroupFilter,
      workLineFilter,
      orderNoFilter,
      materialCodeFilter,
      materialNameFilter,
      materialSpecFilter,
    } = this.state;
    let filters = [];
    filters = filters.concat(getTimeFilter('orderDate', currentViewDate));
    filters.push({
      fieldName: 'type',
      operator: 'EQ',
      fieldType: 'string',
      value: 'INNER',
    });
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
    if (statusFilter) {
      filters.push({
        fieldName: 'status',
        operator: 'EQ',
        fieldType: 'string',
        value: statusFilter,
      });
    }
    if (u9StatusFilter) {
      filters.push({
        fieldName: 'u9Status',
        operator: 'EQ',
        fieldType: 'string',
        value: u9StatusFilter,
      });
    }
    if (workGroupFilter) {
      filters.push({
        fieldName: 'workGroupId',
        operator: 'EQ',
        fieldType: 'string',
        value: workGroupFilter,
      });
    }
    if (workLineFilter) {
      filters.push({
        fieldName: 'workLineId',
        operator: 'EQ',
        fieldType: 'string',
        value: workLineFilter,
      });
    }

    return filters;
  };

  handleWorkgroupSelected = (item, record) => {
    const r = record;
    r.workGroupId = item.id;
    r.workGroupName = item.name;
    this.editData[record.id] = r;
  };

  handleWorkLineSelected = (item, record) => {
    const r = record;
    r.workLineId = item.id;
    r.workLineName = item.name;
    this.editData[record.id] = r;
  };

  getExtableProps = () => {
    const { planInner } = this.props;
    const { currentViewDate, viewDateData } = planInner;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')} onClick={() => this.handleEvent('plan', record)}>
            <Button type="link" color="red">
              下达
            </Button>
          </span>
        ),
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
        width: 230,
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 140,
        required: true,
        render: (_, r) => {
          return (
            <ComboList
              dataSource={this.state.workGroups}
              name="workGroupName"
              field={['workGroupId']}
              showSearch={false}
              pagination={false}
              afterSelect={item => this.handleWorkgroupSelected(item, r)}
              defaultValue={r.workGroupName}
              style={{ width: '100%' }}
              reader={{
                name: 'name',
                field: ['id'],
              }}
            />
          );
        },
      },
      {
        title: '班组',
        dataIndex: 'workLineName',
        width: 140,
        required: true,
        render: (_, r) => {
          const { workLines } = this.state;
          const workGroupId = (this.editData && this.editData.workGroupId) || r.workGroupId;
          const options = workLines.filter(v => {
            if (v.parentId === workGroupId) {
              return true;
            }
            return false;
          });

          return (
            <ComboList
              dataSource={options}
              name="workLineName"
              field={['workLineId']}
              showSearch={false}
              pagination={false}
              afterSelect={item => this.handleWorkLineSelected(item, r)}
              defaultValue={r.workLineName}
              style={{ width: '100%' }}
              reader={{
                name: 'name',
                field: ['id'],
              }}
            />
          );
        },
      },
      {
        title: '创建日期',
        dataIndex: 'orderDate',
        width: 120,
        required: false,
      },
      {
        title: '产能',
        dataIndex: 'capacity',
        width: 120,
        required: false,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        required: true,
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 120,
        required: true,
      },
      {
        title: '物料规格',
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
        title: 'APS状态',
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
        title: '计划开工日期',
        dataIndex: 'planStartDate',
        width: 120,
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
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 1, rightSpan: 23 },
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button onClick={this.handlerExport}>导出</Button>
          <Button onClick={() => this.handleEvent('calcSelectQty')}>计算</Button>
          <Button type="primary" onClick={() => this.handleEvent('batchOrder', null)}>
            批量下达
          </Button>
          <Popconfirm
            title="请确认是否完成工单？"
            onConfirm={() => this.handlerStatusChange('Completed')}
            okText="是"
            cancelText="否"
          >
            <Button>完成</Button>
          </Popconfirm>
          <Popconfirm
            title="请确认是否暂停工单？"
            onConfirm={() => this.handlerStatusChange('Stop')}
            okText="是"
            cancelText="否"
          >
            <Button>暂停</Button>
          </Popconfirm>
          <Popconfirm
            title="请确认是否恢复工单？"
            onConfirm={() => this.handlerStatusChange('NoRelease')}
            okText="是"
            cancelText="否"
          >
            <Button>恢复</Button>
          </Popconfirm>
        </Fragment>
      ),
      right: (
        <Fragment>
          <Button onClick={() => this.handleEvent('calcSelectQty')}>计算</Button>
          工单号{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ orderNoFilter: event.target.value })}
          />
          物料编码{' '}
          <Input
            allowClear
            style={{ width: '150px' }}
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
          车间{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.workGroups}
            allowClear
            name="name"
            field={['id']}
            afterClear={() => this.setState({ workGroupFilter: null })}
            afterSelect={item => this.setState({ workGroupFilter: item.id })}
            reader={{
              name: 'name',
              field: ['id'],
            }}
          />
          班组{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.workLines}
            allowClear
            name="name"
            field={['id']}
            afterClear={() => this.setState({ workLineFilter: null })}
            afterSelect={item => this.setState({ workLineFilter: item.id })}
            reader={{
              name: 'name',
              field: ['id'],
            }}
          />
          APS状态{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.statusOptions}
            allowClear
            name="name"
            field={['code']}
            afterClear={() => this.setState({ statusFilter: null })}
            afterSelect={item => this.setState({ statusFilter: item.code })}
            reader={{
              name: 'name',
              field: ['code'],
            }}
          />
          U9状态{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            allowClear
            dataSource={this.state.u9StatusOptions}
            name="name"
            field={['code']}
            afterClear={() => this.setState({ u9StatusFilter: null })}
            afterSelect={item => this.setState({ u9StatusFilter: item.code })}
            reader={{
              name: 'name',
              field: ['code'],
            }}
          />
          <FilterDate
            title="订单日期过滤"
            currentViewType={currentViewDate}
            viewTypeData={viewDateData}
            onAction={this.handlerFilterDate}
          />
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();
    return {
      showSearch: false,
      columns,
      sort: {
        field: {
          orderDate: 'desc',
          materialCode: null,
          orderNo: null,
          poNo: null,
          deliveryStartDate: null,
        },
      },
      cascadeParams: {
        filters,
      },
      searchProperties: [
        'orderNo',
        'poNo',
        'customerName',
        'materialCode',
        'materialName',
        'materialSpec',
      ],
      checkbox: true,
      lineNumber: false,
      bordered: true,
      toolBar: toolBarProps,
      remotePaging: true,
      searchPlaceHolder: '输入单号/料号/名称/物料规格/客户进行过滤',
      refreshButton: 'empty',
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrder/findByPage`,
        loaded: () => {
          this.tableRef.manualSelectedRows();
        },
      },
      // onSelectRow:()=>{
      //   const { selectedRows } = this.tableRef.state;
      //   message.success(selectedRows.length);
      // }
    };
  };

  getEditModalProps = () => {
    const { loading, planInner } = this.props;
    const { modalVisible, editData } = planInner;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['planInner/save'],
    };
  };

  getOrderPlanModalProps = () => {
    const { loading, planInner } = this.props;
    const { orderPlanModalVisible, editData } = planInner;

    return {
      onSave: this.handleOrderPlan,
      editData,
      workGroups: this.state.workGroups,
      visible: orderPlanModalVisible,
      onClose: this.handleClose,
      saving: loading.effects['planInner/orderPlan'],
    };
  };

  getBatchOrderModalProps = () => {
    const { loading, planInner } = this.props;
    const { batchOrderModalVisible } = planInner;
    return {
      onSave: this.handleBatchPlan,
      visible: batchOrderModalVisible,
      onClose: this.handleClose,
      workLines: this.state.workLines,
      workGroups: this.state.workGroups,
      saving: loading.effects['planInner/batchPlan'],
    };
  };

  render() {
    const { planInner } = this.props;
    const { modalVisible, orderPlanModalVisible, batchOrderModalVisible } = planInner;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        {orderPlanModalVisible ? <OrderPlanModal {...this.getOrderPlanModalProps()} /> : null}
        {batchOrderModalVisible ? <BatchOrderModal {...this.getBatchOrderModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default PlanInner;
