import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { utils, ExtIcon, ExtTable } from 'suid';
import FormModal from './FormModal';
import FormPopover from './PopoverForm';
import styles from './index.less';
import { constants } from '@/utils';

const { authAction } = utils;
const { PROJECT_PATH } = constants;

@connect(({ standardProcess, loading }) => ({ standardProcess, loading }))
class List extends Component {
  state = {
    delRowId: null,
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'standardProcess/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'standardProcess/updatePageState',
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
      type: 'standardProcess/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'standardProcess/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, standardProcess } = this.props;
    const { currPRowData } = standardProcess;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'standardProcess/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'standardProcess/updatePageState',
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
      type: 'standardProcess/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['standardProcess/delPRow'] && delRowId === row.id) {
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
    const { loading, standardProcess } = this.props;
    const { pVisible, currPRowData, isAddP } = standardProcess;

    return {
      save: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['standardProcess/saveParent'],
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
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    tooltip={{ title: '编辑' }}
                    antd
                    authCode="APS-FIRST-GXPZ-SGY-EDIT"
                  />,
                )}
                {authAction(
                  <Popconfirm
                    key="delete"
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                    authCode="APS-FIRST-GXPZ-SGY-DELETE"
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>,
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '生产工艺',
        dataIndex: 'processGroupName',
        width: 160,
        required: true,
      },
      {
        title: '生产线',
        dataIndex: 'name',
        width: 160,
        required: true,
      },
      {
        title: '按区域排产',
        dataIndex: 'byRegion',
        width: 100,
        render: (_text, row) => {
          if (row.byRegion) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 80,
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
        <>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} authCode="APS-FIRST-GXPZ-SGY-ADD">
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
          type: 'standardProcess/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProcessGroup/findByPage`,
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
