import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Popconfirm, Button, message } from 'antd';
import TreeView from '@/components/TreeView';
import FormModal from './FormModal';

@connect(({ organize }) => ({ organize }))
class TreePanel extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organize/queryTree',
    });
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;

      dispatch({
        type: 'organize/updateState',
        payload: {
          selectedTreeNode: selectNodes[0],
        },
      });
    }
  };

  handleCreate = () => {
    // const { organize, dispatch } = this.props;
    const { dispatch } = this.props;

    // if (organize.selectedTreeNode) {
    dispatch({
      type: 'organize/updateState',
      payload: {
        showCreateModal: true,
      },
    });
    // } else {
    //   message.warn('请选择父亲节点！');
    // }
  };

  handleDel = () => {
    const { organize, dispatch } = this.props;
    const { selectedTreeNode } = organize;
    if (selectedTreeNode) {
      dispatch({
        type: 'organize/del',
        payload: {
          id: selectedTreeNode.id,
        },
      }).then(res => {
        if (res.success) {
          dispatch({
            type: 'organize/updateState',
            payload: {
              selectedTreeNode: null,
            },
          });
          this.reloadData();
        }
      });
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organize/updateState',
      payload: {
        showCreateModal: false,
      },
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organize/queryTree',
    });
  };

  getToolBarProps = () => ({
    left: (
      <Fragment>
        <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleCreate}>
          创建节点
        </Button>
        <Popconfirm
          key="delete"
          placement="topLeft"
          title="确定要删除吗，删除后不可恢复？"
          onConfirm={() => this.handleDel()}
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </Fragment>
    ),
  });

  render() {
    const { organize } = this.props;
    const { showCreateModal, treeData } = organize;

    return (
      <div style={{ height: '100%' }}>
        <TreeView
          toolBar={this.getToolBarProps()}
          treeData={treeData}
          onSelect={this.handleSelect}
        />
        {showCreateModal ? (
          <FormModal visible={showCreateModal} onCancel={this.handleCancel} />
        ) : null}
      </div>
    );
  }
}

export default TreePanel;
