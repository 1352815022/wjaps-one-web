import React, { Component } from 'react';
import cls from 'classnames';
import { Menu } from 'antd';
import { get } from 'lodash';
import ExtDropdown from '../ExtDropdown';
import styles from './index.less';

export class Select extends Component {
  state = {
    currItem: null,
  };

  handleSelect = (currItem, dropdownRef) => {
    const { onChange } = this.props;
    this.setState(
      {
        currItem,
      },
      () => {
        if (onChange) {
          onChange(currItem);
        }
        if (dropdownRef) {
          dropdownRef.handleVisibleChange(false);
        }
      },
    );
  };

  dropdownRender = dropdownRef => {
    const { currItem } = this.state;
    const { rowKey = 'id' } = this.props;
    const currItemIdx = get(currItem, rowKey, '');
    const { dataSource = [], name } = this.props;

    if (dataSource && dataSource.length) {
      return (
        <Menu selectedKeys={[currItemIdx]}>
          {dataSource.map(item => {
            const key = get(item, rowKey);
            return (
              <Menu.Item key={key} onClick={() => this.handleSelect(item, dropdownRef)}>
                {get(item, name, '')}
              </Menu.Item>
            );
          })}
        </Menu>
      );
    }

    return <div style={{ padding: '10px 20px', textAlign: 'center' }}>暂无数据</div>;
  };

  render() {
    const { label = '状态', name } = this.props;
    const { currItem } = this.state;
    const value = get(currItem, name, '');
    return (
      <ExtDropdown
        overlay={this.dropdownRender()}
        renderOverLay={this.dropdownRender}
        allowClear={!!currItem}
        onClear={() => this.handleSelect(null)}
        overlayClassName={cls(styles['light-select-dropdown'])}
      >
        <span>
          {label}
          <span className={cls('username')}>{value ? `: ${value}` : ''}</span>
        </span>
      </ExtDropdown>
    );
  }
}

export default Select;
