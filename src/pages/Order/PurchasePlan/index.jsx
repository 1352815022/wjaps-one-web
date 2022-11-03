// eslint-disable-next-line max-classes-per-file
import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import cls from 'classnames';
import { Button, InputNumber, Input, DatePicker, Alert } from 'antd';
import { ComboList, ExtTable, message } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants, getTimeFilter } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ purchasePlan, loading }) => ({ purchasePlan, loading }))
class PurchasePlan extends Component {
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
      type: 'purchasePlan/getColumn',
      payload: { cols: 46 },
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
  }

  state = {
    loading: false,
    cols: 14,
    editingKey: '',
    orderFilterLike: null,
    orderNoFilter: null,
    soNoFilter:null,
    supplierName:null,
    buyFilter:null,
    materialCodeFilter: null,
    materialNameFilter: null,
    materialSpecFilter: null,
    orderFilterOptions: [
      {
        id: 1,
        code: 'PO',
        name: '采购',
      },
      {
        id: 2,
        code: 'PD',
        name: '委外',
      },
    ],
    columns: [],
    column1: [
      {
        title: '需求分类号',
        dataIndex: 'soNo',
        width: 120,
        required: true,
        fixed: 'left',
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
        width: 120,
        required: true,
        fixed: 'left',
      },
      {
        title: '采购单行',
        dataIndex: 'polineNo',
        width: 120,
        required: true,
        fixed: 'left',
      },{
        title: '料号',
        dataIndex: 'materialCode',
        width: 120,
        required: false,
        fixed: 'left',
      },
      {
        title: '料名',
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
        title: '型号',
        dataIndex: 'productModel',
        width: 120,
        required: false,
        fixed: 'left',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 120,
        required: false,
     
      },
      {
        title: '供应商编码',
        dataIndex: 'supplierCode',
        width: 120,
        required: true,
      
      },
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
        width: 120,
        required: true,
      
      },
      {
        title: '采购员',
        dataIndex: 'buyer',
        width: 120,
        required: true,
       
      },
      {
        title: 'SCM开始交货日期',
        dataIndex: 'deliveryStartDate',
        width: 140,
        required: true,
      },
      {
        title: 'SCM最后交货日期',
        dataIndex: 'deliveryEndDate',
        width: 120,
        required: true,
      }, {
        title: '开始排产日期',
        dataIndex: 'startDate',
        width: 140,
        required: true,
      },
      {
        title: '最后排产日期',
        dataIndex: 'endDate',
        width: 120,
        required: true,
      },
      {
        title: '送货数量',
        dataIndex: 'planQty',
        width: 120,
        required: true,
      },
      {
        title: '已送货数',
        dataIndex: 'sumArrivalQty',
        width: 120,
        required: false,
      },
      {
        title: '欠数',
        dataIndex: 'oweQty',
        width: 120,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
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
    this.editData = {};
    this.errorMsgs = {};
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

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'purchasePlan/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      default:
        break;
    }
  };

  getTableFilters = () => {
    const { purchasePlan } = this.props;
    const { currentViewDate } = purchasePlan;
    let filters = [];
    filters = filters.concat(getTimeFilter('deliveryStartDate', currentViewDate));
    const {
      orderFilterLike,
      soNoFilter,
      supplierName,
      buyFilter,
      orderNoFilter,
      materialCodeFilter,
      materialNameFilter,
      materialSpecFilter,
    } = this.state;
    if (orderFilterLike) {
      filters.push({
        fieldName: 'orderNo',
        operator: 'LK',
        fieldType: 'string',
        value: orderFilterLike,
      });
    }
    if (soNoFilter) {
      filters.push({
        fieldName: 'soNo',
        operator: 'LK',
        fieldType: 'string',
        value: soNoFilter,
      });
    }
    if (buyFilter) {
      filters.push({
        fieldName: 'buyer',
        operator: 'LK',
        fieldType: 'string',
        value: buyFilter,
      });
    }
    if (supplierName) {
      filters.push({
        fieldName: 'supplierName',
        operator: 'LK',
        fieldType: 'string',
        value: supplierName,
      });
    }
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

    return filters;
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
        if ((row.planQty || 0) < count) {
          this.errorMsgs[item] = '保存失败，排产数不能大于计划数';
          // message.error('保存失败，排产数不能大于计划数',5);
          errorFlag = true;
        }

        for (const i of dateSet) {
          row[i.dataIndex] = row[i.dataIndex] && row[i.dataIndex].concat(' 00:00:00');
        }

        row.details = details || {};
        params.push(row);
      }
    }
    if (errorFlag) {
      return false;
    }

    this.dispatchAction({
      type: 'purchasePlan/saveAll',
      payload: params,
    }).then(res => {
      if (res.success) {
        this.refresh();
      }
    });
  };

  /** 单行保存方法 */
  handleSave = id => {
    const { column1, columns } = this.state;
    const item = this.editData[id];
    const subSet = columns.filter(i => !column1.includes(i));
    const details = {};

    let count = 0;
    for (const i of subSet) {
      const qty = parseInt(item[i.dataIndex] || 0, 10);
      count += qty;
      details[i.dataIndex] = qty;
    }

    if ((item.planQty || 0) < count) {
      message.error('保存失败，排产数不能大于计划数', 5);
      return false;
    }
    const dateSet = columns.filter(i => i.elem === 'DATE_PICK');

    for (const i of dateSet) {
      item[i.dataIndex] = item[i.dataIndex] && item[i.dataIndex].concat(' 00:00:00');
    }

    item.details = details || {};
    // console.log(item);

    this.dispatchAction({
      type: 'purchasePlan/save',
      payload: item,
    }).then(res => {
      if (res.success) {
        this.refresh();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'purchasePlan/updateState',
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
    this.editData[r.id] = row;
    this.errorMsgs[r.id] = null;
  };

  handleExport = () => {
    this.tableRef.extTool.exportData();
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
    const { purchasePlan } = this.props;
    const { currentViewDate, viewDateData } = purchasePlan;
  
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
          <Button onClick={this.handleExport}>导出</Button>
        </Fragment>
      ),
      right: (
        <Fragment>
          需求分类号{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ soNoFilter: event.target.value })}
          />
           采购员{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ buyFilter: event.target.value })}
          />
           供应商名称{' '}
          <Input
            allowClear
            style={{ width: '120px' }}
            onChange={event => this.setState({ buyFilter: event.target.value })}
          />
           单号{' '}
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
          订单类型过滤{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.orderFilterOptions}
            allowClear
            name="name"
            field={['code']}
            afterClear={() => this.setState({ orderFilterLike: null })}
            afterSelect={item => this.setState({ orderFilterLike: item.code })}
            reader={{
              name: 'name',
              field: ['code'],
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
              this.editRef = {};
              const dom = {};
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
                      size="small"
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
                        style={{ width: '60px' }}
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
                        style={{ width: '60px' }}
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
                        style={{ width: '60px' }}
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
      showSearch:false,
      bordered: true,
      toolBar: toolBarProps,
      onRow: record => {
        return {
          onClick: () => {
            this.edit(record.id);
          },
        };
      },
      cascadeParams: {
        filters,
      },
      sort: {
        field: {
          deliveryStartDate: 'asc',
          materialCode: null,
          supplierCode: null,
          supplierName: null,
          materialName: null,
          deliveryEndDate: null,
        },
      },
      exportData: queryParams => {
        return {
          url: `${PROJECT_PATH}/apsPurchasePlan/export`,
          data: queryParams,
          method: 'POST',
          responseType: 'blob',
        };
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsPurchasePlan/find`,
        params: {
          cols: this.state.cols,
        },
      },
      rowKey: 'id',
      // onChange: this.handleTableChange,
      loading: this.state.loading,
    };
  };

  getEditModalProps = () => {
    const { loading, purchasePlan } = this.props;
    const { modalVisible, editData } = purchasePlan;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['purchasePlan/save'],
    };
  };

  render() {
    const { purchasePlan } = this.props;
    const { modalVisible } = purchasePlan;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default PurchasePlan;
