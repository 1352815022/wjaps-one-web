import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, message } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import FormModal from './FormModal';
import styles from '../../index.less';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
@connect(({ OrganizeProcess, loading }) => ({ OrganizeProcess, loading }))
class TablePanel extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { OrganizeProcess } = this.props;
    const { currNode } = OrganizeProcess;

    if (currNode) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch, OrganizeProcess } = this.props;
    if (OrganizeProcess.currNode) {
      dispatch({
        type: 'OrganizeProcess/updateState',
        payload: {
          modalVisible: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择左侧树形节点');
    }
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'OrganizeProcess/updateState',
      payload: {
        rowData,
        modalVisible: true,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'OrganizeProcess/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'OrganizeProcess/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'OrganizeProcess/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'OrganizeProcess/updateState',
      payload: {
        modalVisible: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['OrganizeProcess/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { OrganizeProcess } = this.props;
    // console.log(this.props)
    const { list, currNode } = OrganizeProcess;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 150,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗, 删除后不可恢复？"
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button key="add" type="primary" onClick={this.add} ignore="true">
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      columns,
      remotePaging: true,
      // loading: loading.effects['OrganizeProcess/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsOrganizeProcessId/findByPage`,
        params: {
          filters: [
            {
              fieldName: 'apsOrganize.id',
              value: currNode.id,
              operator: 'EQ',
            },
          ],
        },
      },
    };
  };

  getFormModalProps = () => {
    const { loading, OrganizeProcess } = this.props;
    const { modalVisible, rowData, currNode } = OrganizeProcess;

    return {
      onSave: this.save,
      editData: rowData,
      visible: modalVisible,
      parentData: currNode,
      onClose: this.handleCloseModal,
      saving: loading.effects['OrganizeProcess/save'],
    };
  };

  render() {
    const { OrganizeProcess } = this.props;
    const { modalVisible } = OrganizeProcess;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <FormModal {...this.getFormModalProps()} /> : null}
      </div>
    );
  }
}

export default TablePanel;
