import React, { Component } from 'react';
import cls from 'classnames';

import styles from './index.less';

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

class Space extends Component {
  test = () => {};

  render() {
    const { children, direction, size = 'small', split } = this.props;
    const childNodes = [].concat(children);

    if (childNodes.length === 0) {
      return null;
    }
    const latestIndex = childNodes.reduce((pre, curr) => {
      if (curr !== null && curr !== undefined) {
        return pre + 1;
      }
      return pre;
    }, 0);

    const nodes = childNodes.map((child, i) => {
      const style =
        i + 1 >= latestIndex
          ? {}
          : {
              [direction === 'vertical' ? 'marginBottom' : 'marginRight']:
                (typeof size === 'string' ? spaceSize[size] : size) / (split ? 2 : 1),
            };
      return (
        <div className={cls('space-item')} key={i} style={style}>
          {child}
        </div>
      );
    });

    return <div className={cls(styles['sei-space'])}>{nodes}</div>;
  }
}

export default Space;
