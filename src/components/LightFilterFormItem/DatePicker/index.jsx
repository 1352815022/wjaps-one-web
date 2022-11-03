import React, { Component } from 'react';
import cls from 'classnames';
import { DatePicker } from 'antd';
import { ExtIcon } from 'suid';
import styles from './index.less';

export class LightDatePicker extends Component {
  state = {
    open: false,
    isHover: false,
    value: null,
  };

  handleMouseEnter = () => {
    this.setState({
      isHover: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      isHover: false,
    });
  };

  handleClear = e => {
    const { onChange } = this.props;
    e.stopPropagation();
    this.setState(
      {
        value: null,
      },
      () => {
        if (onChange) {
          onChange(null, null);
        }
      },
    );
  };

  handleDateChange = (v, f) => {
    const { onChange } = this.props;
    this.setState(
      {
        value: v,
        open: false,
      },
      () => {
        if (onChange) {
          onChange(f, v);
        }
        // setTimeout(() => {
        //   this.setOpen(false);
        // }, 0);
      },
    );
  };

  setOpen = isOpen => {
    this.setState({
      open: isOpen,
    });
  };

  render() {
    const { label = '日期', showTime, format = 'YYYY-MM-DD' } = this.props;
    const { value, isHover, open } = this.state;
    const allowClear = !!value;
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={cls({
          [styles['light-datapicker']]: true,
          [styles['light-datapicker_actived']]: allowClear,
        })}
      >
        <DatePicker
          showTime={showTime}
          format={format}
          value={null}
          onChange={this.handleDateChange}
          onOpenChange={this.setOpen}
          open={open}
        />
        <span onClick={() => this.setOpen(true)}>
          {label}
          <span className={cls('username')}>{value ? `: ${value.format(format)}` : ''}</span>
          {allowClear && isHover ? (
            <ExtIcon type="close" onClick={this.handleClear} antd />
          ) : (
            <ExtIcon type="down" antd />
          )}
        </span>
      </div>
    );
  }
}

export default LightDatePicker;
