import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { ExtModal } from 'suid';

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
    const title = editData ? '编辑' : '新增';

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
          <FormItem label="仓库编码">
            {getFieldDecorator('warehouseCode', {
              initialValue: editData && editData.warehouseCode,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseName', {
              initialValue: editData && editData.warehouseName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="物料编码">
            {getFieldDecorator('materialCode', {
              initialValue: editData && editData.materialCode,
            })(<Input disabled />)}
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
          <FormItem label="库存可用量">
            {getFieldDecorator('storeQty', {
              initialValue: editData && editData.storeQty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="预留数量">
            {getFieldDecorator('reserveQty', {
              initialValue: editData && editData.reserveQty,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="单位">
            {getFieldDecorator('unit', {
              initialValue: editData && editData.unit,
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
