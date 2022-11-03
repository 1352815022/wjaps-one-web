import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
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
    console.log(editData);
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
          <FormItem label="工序代码">
            {getFieldDecorator('processCode', {
              initialValue: editData && editData.processCode,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 50,
                  message: '代码不能超过25个字符',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="工序名称">
            {getFieldDecorator('processName', {
              initialValue: editData && editData.processName,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="排产类型">
            {getFieldDecorator('schedulingType', {
              initialValue: editData && editData.schedulingType,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="工段">
            {getFieldDecorator('processPartName', {
              initialValue: editData && editData.processPartName,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="排产类型">
            {getFieldDecorator('schedulingType', {
              initialValue: editData && editData.schedulingType,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="所属工段">
            {getFieldDecorator('workSection', {
              initialValue: editData && editData.workSection,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="工序描述">
            {getFieldDecorator('description', {
              initialValue: editData && editData.description,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="适用部门">
            {getFieldDecorator('deptId', {
              initialValue: editData && editData.deptId,
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: editData && editData.frozen,
              valuePropName: 'checked',
            })(<Switch disabled={saving} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
