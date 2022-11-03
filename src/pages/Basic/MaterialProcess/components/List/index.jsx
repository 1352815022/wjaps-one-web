import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tag } from 'antd';
import { utils, ExtIcon, ExtTable } from 'suid';
import FormModal from './FormModal';
import FormPopover from './PopoverForm';
import styles from './index.less';
import { constants } from '@/utils';

const { authAction } = utils;
const { PROJECT_PATH } = constants;

@connect(({ materialProcess, loading }) => ({ materialProcess, loading }))
class List extends Component {
  state = {
    delRowId: null,
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'materialProcess/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialProcess/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialProcess/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'materialProcess/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, materialProcess } = this.props;
    const { currPRowData } = materialProcess;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'materialProcess/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'materialProcess/updatePageState',
                payload: {
                  currPRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialProcess/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['materialProcess/delPRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getFormModalProps = () => {
    const { loading, materialProcess } = this.props;
    const { pVisible, currPRowData, isAddP } = materialProcess;

    return {
      save: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['materialProcess/saveParent'],
    };
  };

  reloadData = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  getListCardProps = () => {
    const { dispatch, loading } = this.props;

    return {
      showArrow: false,
      showSearch: false,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProcessGroup/findByPage`,
      },
      remotePaging: true,
      onSelectChange: (_, [selectedItem]) => {
        dispatch({
          type: 'dataShare/updatePageState',
          payload: {
            currPRowData: selectedItem,
          },
        }).then(() => {
          dispatch({
            type: 'dataShare/getConfigById',
            payload: {
              id: selectedItem.id,
            },
          });
        });
      },
      searchProperties: ['code', 'name'],
      itemField: {
        title: item => (
          <>
            {`${item.name} `}
            {item.frozen ? <Tag color="red">冻结</Tag> : null}
          </>
        ),
        description: item => item.code,
        extra: item => {
          return (
            <FormPopover
              onSave={this.handleSave}
              isSaving={loading.effects['dataShare/saveParent']}
              editData={item}
            >
              <trigger-back className="trigger-back" type="edit" tooltip={{ title: '编辑' }} antd />
            </FormPopover>
          );
        },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.getCustomTool,
    };
  };

  getExtableProps = () => {
    const { dispatch } = this.props;
    const columns = [
      {
        title: '料号',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '料名',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 280,
      },
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key="add" type="primary" onClick={this.add}>
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </>
      ),
    };
    return {
      bordered: false,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'materialProcess/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/u9Material/findByPage`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        {/* <ListCard /> */}
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default List;
