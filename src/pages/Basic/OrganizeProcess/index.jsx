import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from 'antd';
import TreeView from '@/components/TreeView';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import TablePanel from './components/TablePanel';

import styles from './index.less';

@withRouter
@connect(({ OrganizeProcess, loading }) => ({ OrganizeProcess, loading }))
class ApsOrganizeProcess extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'OrganizeProcess/queryTree',
    });
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'OrganizeProcess/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        },
      });
    }
  };

  render() {
    const { OrganizeProcess, loading } = this.props;
    const { treeData, currNode } = OrganizeProcess;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout title={['组织机构', currNode && currNode.name]} layout={[8, 16]}>
          <TreeView
            slot="left"
            slotClassName={cls('left-slot-wrapper')}
            treeData={treeData}
            onSelect={this.handleSelect}
          />
          {currNode ? (
            <TablePanel slot="right" slotClassName={cls('right-slot-wrapper')} />
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

export default ApsOrganizeProcess;
