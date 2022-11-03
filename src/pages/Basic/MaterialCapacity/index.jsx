import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ materialCapacity, loading }) => ({ materialCapacity, loading }))
class MaterialCapacity extends Component {
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
          type: 'materialCapacity/updateState',
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
              type: 'materialCapacity/del',
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
      type: 'materialCapacity/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'materialCapacity/updateState',
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
      type: 'materialCapacity/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['materialCapacity/del'] && delId === row.id) {
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
        dataIndex: 'materialDesc',
        width: 120,
        required: true,
      },
      {
        title: '车间',
        dataIndex: 'workGroupName',
        width: 120,
        required: true,
      },
      {
        title: '班组',
        dataIndex: 'workLineName',
        width: 120,
        required: true,
      },
      {
        title: '产能',
        dataIndex: 'standardQty',
        width: 120,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 120,
        required: true,
        render: (_, row) => {
          if (row.frozen) {
            return <Tag color="red">已冻结</Tag>;
          }
          return <Tag color="green">正常</Tag>;
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
        url: `${PROJECT_PATH}/apsMaterialCapacity/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, materialCapacity } = this.props;
    const { modalVisible, editData } = materialCapacity;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['materialCapacity/save'],
    };
  };

  render() {
    const { materialCapacity } = this.props;
    const { modalVisible } = materialCapacity;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default MaterialCapacity;
