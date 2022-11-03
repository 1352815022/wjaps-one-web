import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { ExtTable, ExtIcon, utils } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { authAction } = utils;

const { PROJECT_PATH } = constants;
@withRouter
@connect(({ apsProcess, loading }) => ({ apsProcess, loading }))
class ApsProcess extends Component {
  state = {
    delId: null,
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'apsProcess/updateState',
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
            this.dispatchAction({
              type: 'apsProcess/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.refresh(),
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
    this.dispatchAction({
      type: 'apsProcess/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'apsProcess/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'apsProcess/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['apsProcess/del'] && delId === row.id) {
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
            {authAction(
              <ExtIcon
                key="edit"
                className="edit"
                onClick={() => this.handleEvent('edit', record)}
                type="edit"
                tooltip={{ title: '编辑' }}
                authCode="APS-FIRST-GXPZ-SGX-EDIT"
                antd
              />,
            )}
            {authAction(
              <Popconfirm
                key="del"
                placement="topLeft"
                title="确定要删除吗？"
                onConfirm={() => this.handleEvent('del', record)}
                authCode="APS-FIRST-GXPZ-SGX-DELETE"
              >
                {this.renderDelBtn(record)}
              </Popconfirm>,
            )}
          </span>
        ),
      },
      {
        title: '工序代码',
        dataIndex: 'processCode',
        width: 120,
        required: true,
      },
      {
        title: '工序名称',
        dataIndex: 'processName',
        width: 220,
        required: true,
      },
      {
        title: '排产类型',
        dataIndex: 'schedulingType',
        width: 220,
        required: false,
      },
      {
        title: '工段',
        dataIndex: 'processPartName',
        width: 220,
        required: false,
      },
      {
        title: '所属工段',
        dataIndex: 'workSection',
        width: 220,
        required: false,
      },
      {
        title: '工序描述',
        dataIndex: 'description',
        width: 220,
        required: false,
      },
      {
        title: '适用部门',
        dataIndex: 'deptId',
        width: 220,
        required: false,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 220,
        render: (_text, row) => {
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
          {authAction(
            <Button
              key="add"
              authCode="APS-FIRST-GXPZ-SGX-ADD"
              type="primary"
              onClick={() => {
                this.handleEvent('add', null);
              }}
            >
              新建
            </Button>,
          )}
          <Button onClick={this.refresh}>刷新</Button>
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
        url: `${PROJECT_PATH}/apsProcess/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, apsProcess } = this.props;
    const { modalVisible, editData } = apsProcess;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['apsProcess/save'],
    };
  };

  render() {
    const { apsProcess } = this.props;
    const { modalVisible } = apsProcess;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default ApsProcess;
