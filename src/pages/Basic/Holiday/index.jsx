import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import moment from 'moment';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ holiday, loading }) => ({ holiday, loading }))
class Holiday extends Component {
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
          type: 'holiday/updateState',
          payload: {
            modalVisible: true,
            editData: row,
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
              type: 'holiday/del',
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
      type: 'holiday/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'holiday/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'holiday/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['holiday/del'] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
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
      // {
      //   title: '组织',
      //   dataIndex: 'apsOrganizeDto.name',
      //   width: 120,
      //   required: true,
      // },
      {
        title: '假期名称',
        dataIndex: 'holidayName',
        width: 150,
        required: true,
      },
      {
        title: '开始日期',
        dataIndex: 'startDate',
        width: 120,
        required: true,
        render: (_, row) => {
          if (row.startDate) {
            return moment(row.startDate).format('YYYY-MM-DD');
          }
        },
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        width: 120,
        required: true,
        render: (_, row) => {
          if (row.endDate) {
            return moment(row.endDate).format('YYYY-MM-DD');
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 220,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 80,
        required: true,
        render: (_, row) => {
          if (row.frozen) {
            return <Tag color="red">已冻结</Tag>;
          }
          return '';
        },
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
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsHoliday/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, holiday } = this.props;
    const { modalVisible, editData } = holiday;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['holiday/save'],
    };
  };

  render() {
    const { holiday } = this.props;
    const { modalVisible } = holiday;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default Holiday;
