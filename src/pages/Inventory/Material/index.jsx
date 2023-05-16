import React, { Component,Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button,Tag } from 'antd';
import { ExtTable, ExtIcon, ComboList } from 'suid';
import EditModal from './EditModal';
import { constants } from '@/utils';
import BatchImport from '@/components/BatchImport';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ material, loading }) => ({ material, loading }))
class Material extends Component {
  state = {
    delId: null,
    statusFilter: null,
    statusOptions: [
      {
        code: 1,
        name: '是',
      },
      {
        code: 0,
        name: '否',
      }
    ],
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'material/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            this.dispatchAction({
              type: 'material/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.refresh(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'material/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'material/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'material/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  handlerShowNotCalcMaterialImport= () => {
    this.dispatchAction({
      type: 'material/updateState',
      payload: {
        showNoCalcMaterialImport: true,
      },
    });
  };

  handlerShowEndQtyImport = () => {
    this.dispatchAction({
      type: 'material/updateState',
      payload: {
        showEndQtyImport: true,
      },
    });
  };

  handlerShowPowerImport = () => {
    this.dispatchAction({
      type: 'material/updateState',
      payload: {
        showPowerImport: true,
      },
    });
  };

  handlerNoCalcMaterialDownloadImportTemplate= () => {
    this.dispatchAction({
      type: 'material/getNoCalcMaterialImportTemplate',
    });
  };

  /** 上月期末数导入模板 */
  handlerEndQtyDownloadImportTemplate = () => {
    this.dispatchAction({
      type: 'material/getEndQtyImportTemplate',
    });
  };

  /** 喷粉信息导入模板 */
  handlerPowderDownloadImportTemplate = () => {
    this.dispatchAction({
      type: 'material/getPowderImportTemplate',
    });
  };

  handleImportNoCalcMaterial = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'material/importNoCalcMaterial',
      payload: data,
      callback: res => {
        if (res.success) {
          this.refresh();
        }
      },
    });
  };


  handleImportEndQty = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'material/importEndQty',
      payload: data,
      callback: res => {
        if (res.success) {
          this.refresh();
        }
      },
    });
  };

  handleImportPower = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'material/importPower',
      payload: data,
      callback: res => {
        if (res.success) {
          this.refresh();
        }
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['material/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'code',
        width: 100,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 100,
        required: true,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 180,
        required: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 100,
        required: true,
      },
      {
        title: '损耗',
        dataIndex: 'scrap',
        width: 100,
        required: true,
      },
      {
        title: '产能',
        dataIndex: 'capacity',
        width: 100,
        required: true,
      },
      {
        title: '料品提前期',
        dataIndex: 'fixedLt',
        width: 100,
        required: true,
      },
      {
        title: '是否计算',
        dataIndex: 'calc',
        width: 100,
        required: true,
        render:
        tag => {
          let color = tag===false ? 'red' : 'blue';
          let value=tag===false ? '否' : '是';
          return (
            <span>
            <Tag color={color}>
              {value}
            </Tag>
            </span>
          );
        }
      },
      {
        title: '上月期末数',
        dataIndex: 'endQty',
        width: 100,
        required: true,
      },
      {
        title: '喷粉类型',
        dataIndex: 'powderModel',
        width: 100,
        required: true,
      },
      {
        title: '喷粉面积',
        dataIndex: 'powderArea',
        width: 100,
        required: true,
      },
      {
        title: '清洗面积',
        dataIndex: 'washArea',
        width: 100,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button onClick={this.refresh}>刷新</Button>
          <Button onClick={this.handlerShowNotCalcMaterialImport}>不计算完工料号</Button>
          <Button onClick={this.handlerShowEndQtyImport}>上月期末数导入</Button>
          <Button onClick={this.handlerShowPowerImport}>产能喷粉清洗信息导入</Button>
          是否计算{' '}
          <ComboList
            style={{ width: '120px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.statusOptions}
            name="name"
            allowClear
            field={['code']}
            afterClear={() => this.setState({ statusFilter: null })}
            afterSelect={item => this.setState({ statusFilter: item.code })}
            reader={{
              name: 'name',
              field: ['code'],
            }}
          />
          </Fragment>
       

       
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      cascadeParams: {
        filters,
      },
      searchProperties: [
        'code',
        'name'
      ],
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/u9Material/findByPage`,
      },
    };
  };
  getTableFilters = () => {
    const {statusFilter } = this.state;
    let filters = [];

      filters.push({
        fieldName: 'calc',
        operator: 'EQ',
        fieldType: 'bool',
        value: statusFilter,
      });
    
    return filters;
  };

  getEditModalProps = () => {
    const { loading, material } = this.props;
    const { modalVisible, editData } = material;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['material/save'],
    };
  };

  render() {
    const { material, loading } = this.props;
    const { modalVisible, showEndQtyImport, showPowerImport,showNoCalcMaterialImport } = material;

    return (
      <>
        <div style={{height:"100%"}}><ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /></div>
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        <BatchImport
          title="不计算完工料号导入"
          showImport={showNoCalcMaterialImport}
          closeBatchImport={() =>
            this.dispatchAction({
              type: 'material/updateState',
              payload: {
                showNoCalcMaterialImport: false,
              },
            })
          }
          fields={[
            { field: 'code', title: '料号', required: true },
          ]}
          downloadImportTemplate={this.handlerNoCalcMaterialDownloadImportTemplate}
          downloading={loading.effects['material/getNoCalcMaterialImportTemplate']}
          sendImportData={this.handleImportNoCalcMaterial}
          importDoing={loading.effects['material/importNoCalcMaterial']}
        />
        <BatchImport
          title="上月期末数"
          showImport={showEndQtyImport}
          closeBatchImport={() =>
            this.dispatchAction({
              type: 'material/updateState',
              payload: {
                showEndQtyImport: false,
              },
            })
          }
          fields={[
            { field: 'materialCode', title: '料号', required: true },
            { field: 'endQty', title: '上月期末数', required: true },
          ]}
          downloadImportTemplate={this.handlerEndQtyDownloadImportTemplate}
          downloading={loading.effects['material/getEndQtyImportTemplate']}
          sendImportData={this.handleImportEndQty}
          importDoing={loading.effects['material/importEndQty']}
        />
        <BatchImport
          title="产能"
          showImport={showPowerImport}
          closeBatchImport={() =>
            this.dispatchAction({
              type: 'material/updateState',
              payload: {
                showPowerImport: false,
              },
            })
          }
          fields={[
            { field: 'materialCode', title: '料号', required: false },
            { field: 'capacity', title: '产能', required: false },
            { field: 'powderModel', title: '喷粉类型', required: false },
            { field: 'washArea', title: '清洗面积', required: false },
            { field: 'powderArea', title: '喷粉面积', required: false },
            { field: 'sortNo', title: '工序', required: false },
          ]}
          downloadImportTemplate={this.handlerPowderDownloadImportTemplate}
          downloading={loading.effects['material/getPowderImportTemplate']}
          sendImportData={this.handleImportPower}
          importDoing={loading.effects['material/importPower']}
        />
      </>
    );
  }
}

export default Material;
