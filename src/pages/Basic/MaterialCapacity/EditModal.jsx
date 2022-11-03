import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import { ComboList, ExtModal } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  state = {
    parentId: null,
  };

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('materialId', { initialValue: editData && editData.materialId });
    getFieldDecorator('workGroupId', { initialValue: editData && editData.workGroupId });
    getFieldDecorator('workLineId', { initialValue: editData && editData.workLineId });

    const title = editData ? '编辑' : '新增';

    const getComboListProps = () => {
      return {
        form,
        remotePaging: true,
        name: 'materialCode',
        field: ['materialId', 'materialName', 'materialDesc'],
        store: {
          url: `${PROJECT_PATH}/u9Material/findByPage`,
          type: 'POST',
        },
        reader: {
          name: 'code',
          description: 'spec',
          field: ['id', 'name', 'spec'],
        },
      };
    };

    const getWorkGroupComboListProps = () => {
      return {
        form,
        remotePaging: true,
        name: 'workGroupName',
        field: ['workGroupId'],
        store: {
          url: `${PROJECT_PATH}/apsOrganize/findByFilter`,
          params: {
            filters: [
              {
                fieldName: 'category',
                operator: 'EQ',
                value: 'WorkGroup',
              },
              {
                fieldName: 'frozen',
                operator: 'EQ',
                value: false,
              },
            ],
          },
          type: 'POST',
        },
        afterSelect: item => {
          this.setState({
            parentId: item.id,
          });
        },
        reader: {
          name: 'name',
          field: ['id'],
        },
      };
    };

    const getWorkLineComboListProps = () => {
      return {
        form,
        remotePaging: true,
        cascadeParams: {
          filters: [
            {
              fieldName: 'category',
              operator: 'EQ',
              value: 'Line',
            },
            {
              fieldName: 'frozen',
              operator: 'EQ',
              value: false,
            },
            {
              fieldName: 'parentId',
              operator: 'EQ',
              value: this.state.parentId,
            },
          ],
        },
        name: 'workLineName',
        field: ['workLineId'],
        store: {
          url: `${PROJECT_PATH}/apsOrganize/findByFilter`,
          type: 'POST',
        },
        reader: {
          name: 'name',
          field: ['id'],
        },
      };
    };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="物料编码">
            {getFieldDecorator('materialCode', {
              initialValue: editData && editData.materialCode,
              rules: [
                {
                  required: true,
                  message: '物料编码不能为空',
                },
              ],
            })(<ComboList {...getComboListProps()} />)}
          </FormItem>
          <FormItem label="物料名称">
            {getFieldDecorator('materialName', {
              initialValue: editData && editData.materialName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="物料规格">
            {getFieldDecorator('materialDesc', {
              initialValue: editData && editData.materialDesc,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="车间">
            {getFieldDecorator('workGroupName', {
              initialValue: editData && editData.workGroupName,
              rules: [
                {
                  required: true,
                  message: '车间不能为空',
                },
              ],
            })(<ComboList {...getWorkGroupComboListProps()} />)}
          </FormItem>
          <FormItem label="班组">
            {getFieldDecorator('workLineName', {
              initialValue: editData && editData.workLineName,
              rules: [
                {
                  required: true,
                  message: '班组不能为空',
                },
              ],
            })(<ComboList {...getWorkLineComboListProps()} />)}
          </FormItem>

          <FormItem label="产能">
            {getFieldDecorator('standardQty', {
              initialValue: editData && editData.standardQty,
              rules: [
                {
                  required: true,
                  message: '产能不能为空',
                },
              ],
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: editData && editData.frozen,
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
