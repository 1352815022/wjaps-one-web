import React from 'react';
import { Icon, message } from 'antd';
import screenfull from 'screenfull';

export default class FullScreen extends React.Component {
  state = {
    isFullscreen: false,
  };

  componentDidMount() {
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        this.setState({
          isFullscreen: false,
        });
      }
    };
  }

  handleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.setState({
          isFullscreen: screenfull.isFullscreen,
        });
      });
    } else {
      message.warn('你的浏览器不支持全屏功能');
    }
  };

  checkFull = () => {
    const isFull = document.isFullScreen || document.webkitIsFullScreen || document.mozFullScreen;
    return !!isFull;
  };

  render() {
    const { isFullscreen } = this.state;
    const { className } = this.props;

    return (
      <span onClick={this.handleFullScreen} className={className}>
        <Icon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} style={{ fontSize: '20px' }} />
      </span>
    );
  }
}
