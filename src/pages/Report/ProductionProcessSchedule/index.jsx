import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { ProLayout, SplitLayout } from 'suid';
import List from './components/List';
import Table from './components/Table';
import styles from './index.less';

const { Content } = ProLayout;

@withRouter
@connect(({ productionProcessSchedule }) => ({ productionProcessSchedule }))
class ProductionProcessSchedule extends PureComponent {
  render() {
    const { productionProcessSchedule } = this.props;
    const { currPRowData } = productionProcessSchedule;

    return (
      <SplitLayout direction="vertical" className={cls(styles['container-box'])}>
        <ProLayout>
          <Content>
            <List />
          </Content>
        </ProLayout>
        <ProLayout>
          <Content
            title={`${currPRowData ? currPRowData.materialCode : ''}`}
            empty={{ description: '暂无数据' }}
          >
            {currPRowData && <Table />}
          </Content>
        </ProLayout>
      </SplitLayout>
    );
  }
}

export default ProductionProcessSchedule;
