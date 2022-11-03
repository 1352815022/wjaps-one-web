import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, utils, ExtIcon } from 'suid';
import FormModal from './FormModal';
import styles from '../../index.less';

import { constants } from '@/utils';

const { authAction } = utils;
const { PROJECT_PATH } = constants;

@connect(({ standardProcess, loading }) => ({ standardProcess, loading }))
class Table extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  reloadData = () => {
    const { standardProcess } = this.props;
    const { currPRowData } = standardProcess;
    if (currPRowData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.tableRef && this.tableRef.remoteDataRefresh();
    }
  };

  handleSave = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'standardProcess/save',
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.setState({
          selectedRowKeys: [],
        });
        this.reloadData();
      }
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'standardProcess/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'standardProcess/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, standardProcess } = this.props;
    const { currCRowData } = standardProcess;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'standardProcess/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'standardProcess/updatePageState',
                payload: {
                  currCRowData: null,
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

  save = data => {
    const { dispatch } = this.props;
    console.log(data);
    dispatch({
      type: 'standardProcess/saveChild',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'standardProcess/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'standardProcess/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['standardProcess/delCRow'] && delRowId === row.id) {
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

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { standardProcess } = this.props;
    const { currPRowData } = standardProcess;
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
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key="delete"
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '工序',
        dataIndex: 'apsProcessDto.processName',
        width: 120,
      },
      {
        title: '是否排产',
        dataIndex: 'schedulingFlag',
        width: 180,
        render: (_text, row) => {
          if (row.schedulingFlag) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '是否采集',
        dataIndex: 'acquisitionFlag',
        width: 180,
        render: (_text, row) => {
          if (row.acquisitionFlag) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '采集次数',
        dataIndex: 'acquisitionTimes',
        width: 180,
      },
      {
        title: '是否报产',
        dataIndex: 'productionFlag',
        width: 180,
        render: (_text, row) => {
          if (row.productionFlag) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '加工次数',
        dataIndex: 'processingTimes',
        width: 180,
      },
      {
        title: '报产方式',
        dataIndex: 'outputType',
        width: 180,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      cascadeParams: {
        parentId: currPRowData && currPRowData.id,
      },
      selectedRowKeys,
      searchProperties: ['code', 'name'],
      onSelectRow: selectedKeys => {
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = [];
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns,
      remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/apsProcessGroupInfo/findByPage`,
        params: {
          filters: [
            {
              fieldName: 'apsProcessGroup.id',
              value: currPRowData.id,
              operator: 'EQ',
            },
          ],
        },
      },
    };
  };

  getFormModalProps = () => {
    const { loading, standardProcess } = this.props;
    const { currPRowData, currCRowData, cVisible } = standardProcess;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['standardProcess/saveChild'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default Table;
