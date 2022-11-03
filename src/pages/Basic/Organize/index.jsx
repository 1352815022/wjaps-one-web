import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import TreePanel from './components/TreePanel';
import FormPanel from './components/FormPanel';
import styles from './index.less';

@withRouter
@connect(({ organize, loading }) => ({ organize, loading }))
class Organize extends Component {
  render() {
    const { organize, loading } = this.props;
    const { selectedTreeNode } = organize;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['组织架构', selectedTreeNode && selectedTreeNode.name]}
          layout={[10, 14]}
        >
          <TreePanel slot="left" slotClassName={cls('left-slot-wrapper')} />
          {selectedTreeNode ? (
            <FormPanel key={selectedTreeNode.id} slot="right" />
          ) : (
            <Empty
              slot="right"
              className={cls('empty-wrapper')}
              description="请选择左边的树节点进行操作"
            />
          )}
        </CascadeLayout>
      </PageWrapper>
    );
  }
}

export default Organize;
