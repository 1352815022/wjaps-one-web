import React, { PureComponent } from 'react';
import { Dropdown } from 'antd';
import { ExtIcon } from 'suid';
import cls from 'classnames';
import styles from './index.less';

export default class HeaderDropdown extends PureComponent {
  static dropdownElm;

  constructor(props) {
    super(props);
    this.dropdownElm = null;
    this.state = {
      visible: false,
      isHover: false,
    };
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
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

  render() {
    const { visible, isHover } = this.state;
    const {
      overlayClassName,
      className,
      children,
      allowClear,
      renderOverLay,
      overlay,
      onClear,
      ...props
    } = this.props;
    return (
      <Dropdown
        trigger={['click']}
        onVisibleChange={this.handleVisibleChange}
        ref={node => (this.dropdownElm = node)}
        visible={visible}
        className={cls({
          [className]: true,
          [styles.container]: true,
          [styles.container_actived]: allowClear,
        })}
        overlayClassName={cls(styles['overlay-container'], overlayClassName)}
        overlay={renderOverLay ? renderOverLay(this) : overlay}
        {...props}
      >
        <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          {children}
          {allowClear && isHover ? (
            <ExtIcon
              type="close"
              onClick={e => {
                e.stopPropagation();
                if (onClear) {
                  onClear();
                }
              }}
              antd
            />
          ) : (
            <ExtIcon type="down" antd />
          )}
        </div>
      </Dropdown>
    );
  }
}
