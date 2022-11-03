import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ stock, loading }) => ({ stock, loading }))
class Stock extends Component {
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
          type: 'stock/updateState',
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
              type: 'stock/del',
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
      type: 'stock/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'stock/updateState',
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
      type: 'stock/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  handleExportData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stock/exportData',
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['stock/del'] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  validateItem = data => {
    return data.map(d => {
      return {
        ...d,
        validate: true,
        status: '验证通过',
        statusCode: 'success',
        message: '验证通过',
      };
    });
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
          </span>
        ),
      },

      {
        title: '仓库名称',
        dataIndex: 'whName',
        width: 120,
        required: true,
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
        title: '库存可用量',
        dataIndex: 'storeQty',
        width: 120,
        required: true,
      },
      {
        title: '预留数量',
        dataIndex: 'reserveQty',
        width: 120,
        required: true,
      },

      {
        title: '单位',
        dataIndex: 'unit',
        width: 120,
        required: true,
      },
      {
        title: '同步时间',
        dataIndex: 'syncTime',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.reloadData}>刷新</Button>
          <Button
            onClick={() => {
              this.handleExportData();
            }}
          >
            导出
          </Button>
        </Fragment>
      ),
    };
    return {
      columns,
      bordered: false,
      searchProperties: ['whName', 'materialCode', 'materialName', 'materialDesc'],
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/u9Stock/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, stock } = this.props;
    const { modalVisible, editData } = stock;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['stock/save'],
    };
  };

  render() {
    const { stock } = this.props;
    const { modalVisible } = stock;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default Stock;
