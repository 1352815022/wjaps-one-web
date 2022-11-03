import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import cls from 'classnames';
import styles from './index.less';

export default class CascadeLayout extends PureComponent {
  renderChildren = () => {
    const { children, title = ['左标题', '右标题'], layout = [10, 14] } = this.props;
    const [leftTitle, rightTitle] = title;
    const [leftSpan, rightSpan] = layout;
    const bordered = false;

    if (!children) {
      return null;
    }

    return []
      .concat(children)
      .map(child => {
        const { slot, slotClassName } = child.props;
        if (['left', 'right'].includes(slot)) {
          if (slot === 'left') {
            return (
              <Col key={slot} className={cls('layout-col', slotClassName)} span={leftSpan}>
                <Card title={leftTitle} bordered={bordered}>
                  {child}
                </Card>
              </Col>
            );
          }
          if (slot === 'right') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-col-right', slotClassName)}
                span={rightSpan}
              >
                <Card title={rightTitle} bordered={bordered}>
                  {child}
                </Card>
              </Col>
            );
          }
        }

        return null;
      })
      .filter(child => !!child);
  };

  render() {
    const { className } = this.props;

    return (
      <Row gutter={8} className={cls(styles['cascade-layout-wrapper'], className)}>
        {this.renderChildren()}
      </Row>
    );
  }
}
