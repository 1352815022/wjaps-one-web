import React, { Component } from 'react';
import { Input, Tree, Empty, Row, Col } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import { cloneDeep, isEqual } from 'lodash';
import cls from 'classnames';

const { TreeNode } = Tree;

const { Search } = Input;

class TreeView extends Component {
  constructor(props) {
    super(props);
    this.treeData = props.treeData;
    this.state = {
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      filterTreeData: cloneDeep(this.treeData),
    };
  }

  componentDidUpdate() {
    const { treeData } = this.props;
    const { searchValue } = this.state;
    if (!isEqual(this.treeData, treeData)) {
      this.treeData = treeData;
      this.updateTreeState(searchValue, treeData);
    }
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  updateTreeState = (searchValue, treeData) => {
    const expandedKeys = [];
    const filterTreeData = this.findNode(searchValue, cloneDeep(treeData));
    this.getExpandedKeys(filterTreeData, expandedKeys);
    const autoExpandParent = searchValue !== '';
    this.setState({
      filterTreeData,
      searchValue,
      autoExpandParent,
      expandedKeys,
    });
  };

  handleSearch = value => {
    this.updateTreeState(value, this.treeData);
  };

  handleCheck = (checkedKeys, info) => {
    const { onChange } = this.props;
    const checkedItems = [];
    info.checkedNodes.forEach(item => {
      checkedItems.push(item.props.dataRef);
    });

    this.setState(
      {
        checkedKeys,
      },
      () => {
        if (onChange) {
          onChange(checkedItems[0]);
        }
      },
    );
  };

  handleSelect = (selectedKeys, info) => {
    if (selectedKeys && selectedKeys.length) {
      const { onSelect, onChange } = this.props;
      const selectedItems = [];
      info.selectedNodes.forEach(item => {
        selectedItems.push(item.props.dataRef);
      });

      this.setState(
        {
          selectedKeys,
        },
        () => {
          if (onChange) {
            onChange(selectedItems[0]);
          }
          if (onSelect) {
            onSelect(selectedItems);
          }
        },
      );
    }
  };

  // 查找关键字节点
  findNode = (value, tree) => {
    return tree
      .map(node => {
        const treeNode = cloneDeep(node);
        const isInclude = treeNode.name.includes(value);
        // 如果有子节点
        if (treeNode.children && treeNode.children.length > 0) {
          treeNode.children = this.findNode(value, treeNode.children);
          // 如果标题匹配
          if (isInclude) {
            return treeNode;
          }
          // 如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = this.findNode(value, treeNode.children);
          if (treeNode.children && treeNode.children.length > 0) {
            return treeNode;
          }
          return null;
        }
        // 没子节点
        if (isInclude) {
          return treeNode;
        }
        return null;
      })
      .filter(treeNode => treeNode);
  };

  getExpandedKeys = (data, result = []) => {
    data.forEach(item => {
      result.push(item.id);
      if (item.children && item.children.length > 0) {
        this.getExpandedKeys(item.children, result);
      }
    });
    return result;
  };

  getTreeNodes = data =>
    data.map(item => {
      const { children, name, id } = item;
      const { selectable } = this.props;

      if (children && children.length > 0) {
        return (
          <TreeNode title={name} key={id} dataRef={item} selectable={selectable}>
            {this.getTreeNodes(children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" />}
          title={name}
          key={id}
          dataRef={item}
          isLeaf
        />
      );
    });

  getToolTar = () => {
    const { toolBar } = this.props;
    const colStyle = { marginBottom: 6 };
    const { type = 'inline', layout: customLayout, left } = toolBar || {};

    if (type === 'inline') {
      let layout = {
        leftSpan: 0,
        rightSpan: 24,
      };
      if (left) {
        layout = {
          leftSpan: 12,
          rightSpan: 12,
        };
        layout = Object.assign(layout, customLayout);
      }

      return (
        <Row style={colStyle}>
          <Col span={layout.leftSpan}>{left}</Col>
          <Col span={layout.rightSpan}>
            <Search
              allowClear
              placeholder="请输入名称搜索"
              onSearch={this.handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      );
    }
    if (type === 'vertical') {
      return (
        <Row>
          {left ? <Col style={colStyle}>{left}</Col> : null}
          <Col style={colStyle}>
            <Search
              allowClear
              placeholder="请输入名称搜索"
              onSearch={this.handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      );
    }
  };

  render() {
    const {
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      filterTreeData,
    } = this.state;
    const { height = '100%', toolBar } = this.props;
    const { type } = toolBar || {};
    const toolBarHeight = type === 'vertical' ? 76 : 38;

    return (
      <div style={{ height }}>
        {this.getToolTar()}
        <div style={{ height: `calc(100% - ${toolBarHeight}px)` }}>
          <ScrollBar>
            {filterTreeData && filterTreeData.length ? (
              <Tree
                onCheck={this.handleCheck}
                onSelect={this.handleSelect}
                checkable={false}
                blockNode
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                switcherIcon={<ExtIcon type="down" antd />}
              >
                {this.getTreeNodes(filterTreeData)}
              </Tree>
            ) : (
              <Empty className={cls('empty-wrapper')} description="暂无数据" />
            )}
          </ScrollBar>
        </div>
      </div>
    );
  }
}

export default TreeView;
