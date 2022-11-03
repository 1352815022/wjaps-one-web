import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout } from 'suid';
import List from './components/List';
import Table from './components/Table';
import styles from './index.less';

const { Header, SiderBar, Content } = ProLayout;

@withRouter
@connect(({ materialProcess }) => ({ materialProcess }))
class MaterialProcess extends PureComponent {
  render() {
    const { materialProcess } = this.props;
    const { currPRowData } = materialProcess;
    return (
      <ProLayout className={cls(styles['container-box'])}>
        <SiderBar width={700} gutter={[0, 8]}>
          <ProLayout>
            <Header title="产品工艺" />
            <Content>
              <List />
            </Content>
          </ProLayout>
        </SiderBar>
        <ProLayout>
          <Header title={`${currPRowData ? currPRowData.name : ''}`} />
          <Content empty={{ description: '暂无数据' }}>{currPRowData && <Table />}</Content>
        </ProLayout>
      </ProLayout>
    );
  }
}

export default MaterialProcess;
