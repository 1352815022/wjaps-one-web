// eslint-disable-next-line max-classes-per-file
import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import cls from 'classnames';
import { Alert, Button, DatePicker, Input, InputNumber, message } from 'antd';
import { ComboList, ExtTable } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ productionPlan, loading }) => ({ productionPlan, loading }))
class ProductionPlan extends Component {
  static editData;

  static errorMsgs;

  static editRef;

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.editData = {};
    this.errorMsgs = {};
    this.editRef = {};
    dispatch({
      type: 'productionPlan/getColumn',
      payload: { cols: 15 },
    }).then(res => {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const tempColumn = this.state.column1.concat(res);
      for (const item of tempColumn) {
        item.className = cls(styles['table-padding']);
        if (item.editFlag) {
          item.editable = true;
        }
      }
      this.setState({
        columns: tempColumn,
      });
    });

    // 初始化车间
    dispatch({
      type: 'productionPlan/findOrgsByFilter',
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
          type: 'productionPlan/findOrgsByFilter',
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
    // filters:[{fieldName:"id",operator:"EQ",value:"220F2F6A-D4F1-11EC-970A-4401BBA2DB91"},{fieldName:"orderId",operator:"EQ",value:"6236849B-D296-11EC-9B24-4401BBA2DB91"}],
    cols: 15,
    editingKey: '',
    workGroups: [],
    workLines: [],
    workGroupFilter: null,
    workLineFilter: null,
    columns: [],
    column1: [
      {
        title: '提示信息',
        key: 'operation',
        width: 200,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        ellipsis: false,
        fixed: 'left',
        required: false,
        render: (_, record) => {
          const errMsg = this.errorMsgs[record.id] || null;
          return (
            <span className={cls('action-box')}>
              {errMsg ? <Alert message={errMsg} type="error" banner /> : null}
            </span>
          );
        },
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 100,
        required: false,
        fixed: 'left',
      },
      {
        title: '生产线',
        dataIndex: 'lineName',
        width: 100,
        required: false,
        fixed: 'left',
      },
      {
        title: '工单号',
        dataIndex: 'orderNo',
        width: 160,
        required: true,
        fixed: 'left',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        required: false,
        fixed: 'left',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 120,
        required: false,
        fixed: 'left',
      },
      {
        title: '规格',
        dataIndex: 'materialSpec',
        width: 120,
        required: false,
        fixed: 'left',
      },
      {
        title: 'SCM交期',
        dataIndex: 'scmDeliveryDate',
        width: 100,
        required: true,
      },

      {
        title: '产能',
        dataIndex: 'standardQty',
        width: 80,
        required: false,
      },

      {
        title: '订单数',
        dataIndex: 'orderQty',
        width: 80,
        required: false,
      },
      {
        title: '计划数',
        dataIndex: 'planQty',
        width: 80,
        required: true,
      },
      {
        title: '已完成数',
        dataIndex: 'hasQty',
        width: 80,
        required: false,
      },
      // {
      //   title: '欠数',
      //   dataIndex: 'oweQty',
      //   width: 80,
      //   required: true,
      // },
      {
        title: '待排数',
        dataIndex: 'awaitQty',
        width: 80,
        required: true,
      },
      {
        title: '计划开始',
        dataIndex: 'startDate',
        width: 100,
        required: true,
        elem: 'DATE_PICK',
      },
      {
        title: '计划结束',
        dataIndex: 'endDate',
        width: 100,
        required: true,
      },
      {
        title: '修改人',
        dataIndex: 'lastEditorName',
        width: 100,
        required: true,
      },
      {
        title: '修改时间',
        dataIndex: 'lastEditedDate',
        width: 200,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 150,
        required: false,
        elem: 'INPUT',
        editFlag: true,
      },
    ],
  };

  // 注销全局静态变量 避免内存溢出
  componentWillUnmount() {
    this.editRef = null;
    this.errorMsgs = null;
    this.editData = null;
  }

  loadData = () => {
    this.tableRef.remoteDataRefresh();
  };

  getTableFilters = () => {
    const {
      workGroupFilter,
      workLineFilter,
      materialCodeFilter,
      materialNameFilter,
      materialSpecFilter,
      orderNoFilter,
    } = this.state;
    const filters = [];
    filters.push({
      fieldName: 'status',
      operator: 'EQ',
      value: 'Normal',
    });
    if (orderNoFilter) {
      filters.push({
        fieldName: 'order.orderNo',
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
        fieldName: 'lineId',
        operator: 'EQ',
        fieldType: 'string',
        value: workLineFilter,
      });
    }

    return filters;
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  refresh = () => {
    this.loadData();
  };

  handleEvent = type => {
    this.edit(null);
    const { selectedRows } = this.tableRef.state;
    switch (type) {
      case 'batchPlan': {
        if (selectedRows.length === 0) {
          message.error('请选择需要排产的记录');
          return;
        }
        this.dispatchAction({
          type: 'productionPlan/updateState',
          payload: {
            modalVisible: true,
            modalType: false,
          },
        });
        break;
      }
      case 'clearPlan': {
        if (selectedRows.length === 0) {
          message.error('请选择需要清空排产的记录');
          return;
        }
        this.dispatchAction({
          type: 'productionPlan/updateState',
          payload: {
            modalVisible: true,
            modalType: true,
          },
        });
        break;
      }

      default:
        break;
    }
  };

  /** 多行保存方法 */
  handleSaveAll = () => {
    const { column1, columns } = this.state;
    const subSet = columns.filter(i => !column1.includes(i));
    const dateSet = columns.filter(i => i.elem === 'DATE_PICK');
    const items = this.editData;
    const params = [];
    let errorFlag = false;
    for (const item in items) {
      if (items.hasOwnProperty(item)) {
        const row = items[item];
        const details = {};
        let count = 0;
        for (const i of subSet) {
          const qty = parseInt(row[i.dataIndex] || 0, 10);
          count += qty;
          details[i.dataIndex] = qty;
        }
        if ((row.orderQty || 0) < count) {
          this.errorMsgs[item] = '保存失败，排产数不能大于订单数';
          // message.error('保存失败，排产数不能大于计划数',5);
          errorFlag = true;
        }

        for (const i of dateSet) {
          row[i.dataIndex] = row[i.dataIndex] && row[i.dataIndex];
        }

        row.details = details || {};
        params.push(row);
      }
    }
    if (errorFlag) {
      return false;
    }

    this.dispatchAction({
      type: 'productionPlan/saveAll',
      payload: params,
    }).then(res => {
      if (res.success) {
        this.refresh();
      }
    });
  };

  /**
   * 批量排产 or 批量清空
   */
  handleBatchEdit = data => {
    const { productionPlan } = this.props;
    const { modalType } = productionPlan;
    const { selectedRows } = this.tableRef.state;
    const { planQty, planDate } = data;
    // 清空
    if (modalType) {
      for (let i = 0; i < selectedRows.length; i += 1) {
        selectedRows[i][planDate] = 0;
        this.editData[selectedRows[i].id] = selectedRows[i];
      }
    } else {
      // 排产
      let tempQty = planQty;
      for (let i = 0; i < selectedRows.length; i += 1) {
        // 批量排产中，待排=0 或已排数量跳过
        if (selectedRows[i].awaitQty === 0 || selectedRows[i][planDate]) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (tempQty > selectedRows[i].awaitQty) {
          selectedRows[i][planDate] = selectedRows[i].awaitQty;
          tempQty -= selectedRows[i].awaitQty;
        } else {
          selectedRows[i][planDate] = tempQty;
          tempQty = 0;
        }
        this.editData[selectedRows[i].id] = selectedRows[i];
      }
      if (tempQty > 0) {
        message.error('排产数量大于勾选单据的待排数量');
        return;
      }
    }

    this.handleSaveAll();
    this.handleClose();
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'productionPlan/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  isEditing = record => {
    return record.id === this.state.editingKey ? 1 : 0;
  };

  handleCellSave = (e, r, c) => {
    const row = r;
    row[c.dataIndex] = e.target.value;
    // console.log(e,r,c);
    this.editData[r.id] = row;
    this.errorMsgs[r.id] = null;
  };

  handleDateCellSave = (d, r, c) => {
    const row = r;
    row[c.dataIndex] = d;
    this.editData[r.id] = row;
    this.errorMsgs[r.id] = null;
  };

  // 移动单元格值
  handleCellValueMove = (t, r, c) => {
    const row = r;
    // 无值不进行处理
    if (!row[c.dataIndex]) {
      return;
    }
    const temp = Number.parseInt(row[c.dataIndex], 10);
    row[c.dataIndex] = 0;
    // 获取下一个单元格
    const split = c.dataIndex.split('-');
    // 移动方向
    let direction;
    if (t === 'LEFT') {
      direction = -1;
    } else {
      direction = 1;
    }
    split[split.length - 1] = Number.parseInt(split[split.length - 1], 10) + direction;
    const dataIndex = split.join('-');
    // 赋值
    if (row[dataIndex]) {
      row[dataIndex] = Number.parseInt(row[dataIndex], 10) + temp;
    } else {
      row[dataIndex] = temp;
    }
    this.editData[row.id] = row;
    this.editRef[c.dataIndex].inputNumberRef.setState({ value: 0 });
    this.editRef[dataIndex].inputNumberRef.setState({ value: row[dataIndex] });
  };

  getExtableProps = () => {
    const toolBarProps = {
      layout: { leftSpan: 3, rightSpan: 21 },
      left: (
        <Fragment>
          <Button
            key="add"
            icon="save"
            type="primary"
            onClick={() => {
              this.handleSaveAll();
            }}
            ignore="true"
          >
            保存
          </Button>
          <Button onClick={this.refresh}>刷新</Button>
          {/* <Button onClick={() => this.handleEvent('batchPlan')}>批量排产</Button>
          <Button onClick={() => this.handleEvent('clearPlan')}>批量清空</Button> */}
        </Fragment>
      ),
      right: (
        <Fragment>
          工单号{' '}
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
        </Fragment>
      ),
    };
    const filters = this.getTableFilters();

    return {
      columns: this.state.columns.map(col => {
        const c = col;
        if (!c.hasOwnProperty('render')) {
          c.render = (_, r, i) => {
            const editRow = this.editData[i.id];
            if (c.editable && this.isEditing(r)) {
              const dom = {};
              this.editRef = {};
              const leftCaret = (
                <Button
                  size="small"
                  icon="caret-left"
                  type="link"
                  style={{ width: '20px' }}
                  onClick={() => this.handleCellValueMove('LEFT', r, c)}
                />
              );
              const rightCaret = (
                <Button
                  size="small"
                  icon="caret-right"
                  type="link"
                  style={{ width: '20px' }}
                  onClick={() => this.handleCellValueMove('RIGHT', r, c)}
                />
              );
              switch (c.elem) {
                case 'INPUT':
                  dom.a = (
                    <Input
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      ref={inst => (this.editRef[c.dataIndex] = inst)}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                    />
                  );
                  break;
                case 'INPUT_NUMBER':
                  dom.a = (
                    <InputNumber
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      ref={inst => (this.editRef[c.dataIndex] = inst)}
                      min={0}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                    />
                  );
                  break;
                case 'INPUT_NUMBER_ALL':
                  dom.a = (
                    <Fragment>
                      {leftCaret}
                      <InputNumber
                        onBlur={e => {
                          this.handleCellSave(e, r, c);
                        }}
                        ref={inst => (this.editRef[c.dataIndex] = inst)}
                        style={{ width: '100px' }}
                        min={0}
                        defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      />
                      {rightCaret}
                    </Fragment>
                  );
                  break;
                case 'INPUT_NUMBER_LEFT':
                  dom.a = (
                    <Fragment>
                      {leftCaret}
                      <InputNumber
                        onBlur={e => {
                          this.handleCellSave(e, r, c);
                        }}
                        ref={inst => (this.editRef[c.dataIndex] = inst)}
                        min={0}
                        style={{ width: '100px' }}
                        defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      />
                    </Fragment>
                  );
                  break;
                case 'INPUT_NUMBER_RIGHT':
                  dom.a = (
                    <Fragment>
                      <InputNumber
                        onBlur={e => {
                          this.handleCellSave(e, r, c);
                        }}
                        style={{ width: '100px' }}
                        ref={inst => (this.editRef[c.dataIndex] = inst)}
                        min={0}
                        defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      />
                      {rightCaret}
                    </Fragment>
                  );
                  break;
                case 'DATE_PICK': // 暂未用到
                  dom.a = (
                    <DatePicker
                      ref={node => (this.input = node)}
                      onChange={(m, d) => {
                        this.handleDateCellSave(d, r, c);
                      }}
                      format="YYYY-MM-DD"
                      value={
                        (editRow && editRow[c.dataIndex] && moment(editRow[c.dataIndex])) ||
                        (r[c.dataIndex] && moment(r[c.dataIndex]))
                      }
                    />
                  );
                  break;
                default:
                  break;
              }
              return dom.a;
            }
            return r[col.dataIndex];
          };
        }

        return c;
      }),
      bordered: true,
      toolBar: toolBarProps,
      onRow: record => {
        return {
          onClick: () => {
            this.edit(record.id);
          },
        };
      },
      sort: {
        field: {
          materialCode: null,
          materialName: null,
          materialSpec: null,
          startDate: null,
        },
      },
      cascadeParams: { filters },
      searchProperties: ['order.orderNo', 'materialCode', 'materialName'],
      remotePaging: true,
      checkbox: true,
      lineNumber: false,
      searchPlaceHolder: '输入 单号/料号/料名 进行过滤',
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrderPlan/find`,
        params: {
          cols: this.state.cols,
        },
        loaded: () => {
          this.editData = {};
          this.errorMsgs = {};
          this.tableRef.manualSelectedRows();
          this.edit(null);
        },
      },
      rowKey: 'id',
    };
  };

  getEditModalProps = () => {
    const { loading, productionPlan } = this.props;
    const { modalVisible, modalType } = productionPlan;

    return {
      modalType,
      onSave: this.handleBatchEdit,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['productionPlan/save'],
    };
  };

  render() {
    const { productionPlan } = this.props;
    const { modalVisible } = productionPlan;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default ProductionPlan;
