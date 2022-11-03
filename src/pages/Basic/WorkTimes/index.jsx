import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import MultiAddModal from './MultiAddModal';
import styles from './index.less';
import { constants } from '@/utils';
import FilterDate from '@/components/FilterDate';

const { PROJECT_PATH, SEARCH_DATE_PERIOD } = constants;
const startFormat = 'YYYY-MM-DD';
const endFormat = 'YYYY-MM-DD';
@withRouter
@connect(({ workTimes, loading }) => ({ workTimes, loading }))
class WorkTimes extends Component {
  state = {
    delId: null,
  };

  reloadData = () => {
    this.tableRef.remoteDataRefresh();
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch (type) {
      case 'add':
      case 'edit':
        dispatch({
          type: 'workTimes/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'multiAdd':
        dispatch({
          type: 'workTimes/updateState',
          payload: {
            multiAddModalVisible: true,
            multiAddData: null,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            dispatch({
              type: 'workTimes/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.reloadData(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'workTimes/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'workTimes/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleMultiAdd = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'workTimes/multiAdd',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'workTimes/updateState',
          payload: {
            multiAddModalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workTimes/updateState',
      payload: {
        modalVisible: false,
        multiAddModalVisible: false,
        editData: null,
        multiAddData: null,
      },
    });
  };

  handlerFilterDate = currentViewDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workTimes/updateState',
      payload: {
        currentViewDate,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['workTimes/del'] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getTableFilters = () => {
    const { workTimes } = this.props;
    const { currentViewDate } = workTimes;
    const filters = [];
    const currentDate = moment();
    const { name: searchDateType, startTime = null, endTime = null } = currentViewDate;
    switch (searchDateType) {
      case SEARCH_DATE_PERIOD.THIS_MONTH.name:
        filters.push({
          fieldName: 'workDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('month').format(startFormat),
        });
        filters.push({
          fieldName: 'workDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('month').format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.THIS_WEEK.name:
        filters.push({
          fieldName: 'workDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.startOf('week').format(startFormat),
        });
        filters.push({
          fieldName: 'workDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.endOf('week').format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.TODAY.name:
        filters.push({
          fieldName: 'workDate',
          operator: 'GE',
          fieldType: 'date',
          value: currentDate.format(startFormat),
        });
        filters.push({
          fieldName: 'workDate',
          operator: 'LE',
          fieldType: 'date',
          value: currentDate.format(endFormat),
        });
        break;
      case SEARCH_DATE_PERIOD.PERIOD.name:
        filters.push({
          fieldName: 'workDate',
          operator: 'GE',
          fieldType: 'date',
          value: moment(startTime).format(startFormat),
        });
        filters.push({
          fieldName: 'workDate',
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

  getExtableProps = () => {
    const { workTimes } = this.props;
    const { currentViewDate, viewDateData } = workTimes;
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
          <span className={cls('action-box')}>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              ignore="true"
              tooltip={{ title: '编辑' }}
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '组织名称',
        dataIndex: 'apsOrganizeName',
        width: 120,
        required: true,
      },
      {
        title: '上班日期',
        dataIndex: 'workDate',
        width: 120,
        required: true,
      },
      {
        title: '标准上班时长',
        dataIndex: 'workHour',
        width: 120,
        required: true,
      },
      {
        title: '加班时长',
        dataIndex: 'overTimeHour',
        width: 120,
        required: true,
      },
      {
        title: '人数',
        dataIndex: 'numOfPeople',
        width: 120,
        required: true,
      },
      {
        title: '总时长',
        dataIndex: 'totalHour',
        width: 120,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
          <Button
            icon="container"
            onClick={() => {
              this.handleEvent('multiAdd', null);
            }}
          >
            批量新增
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
      right: (
        <FilterDate
          title="上班日期"
          currentViewType={currentViewDate}
          viewTypeData={viewDateData}
          onAction={this.handlerFilterDate}
        />
      ),
    };
    const filters = this.getTableFilters();
    return {
      cascadeParams: {
        filters,
      },
      columns,
      bordered: false,
      toolBar: toolBarProps,
      showSearch: false,
      remotePaging: true,
      searchProperties: ['id'],
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsWorkingTimes/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, workTimes } = this.props;
    const { modalVisible, editData } = workTimes;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['workTimes/save'],
    };
  };

  getMultiAddModalProps = () => {
    const { loading, workTimes } = this.props;
    const { multiAddModalVisible, multiAddData } = workTimes;

    return {
      onSave: this.handleMultiAdd,
      multiAddData,
      visible: multiAddModalVisible,
      onClose: this.handleClose,
      saving: loading.effects['workTimes/multiAdd'],
    };
  };

  render() {
    const { workTimes } = this.props;
    const { modalVisible, multiAddModalVisible } = workTimes;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        {multiAddModalVisible ? <MultiAddModal {...this.getMultiAddModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default WorkTimes;
