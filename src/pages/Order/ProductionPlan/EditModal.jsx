import React, { PureComponent } from 'react';
import { Form, DatePicker, InputNumber } from 'antd';
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
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      if (onSave) {
        params.planDate = params.planDate.format('YYYY-MM-DD');
        onSave(params);
      }
    });
  };

  render() {
    const { form, onClose, modalType, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = modalType ? '清空排产' : '批量排产';

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
          {modalType ? null : (
            <FormItem label="合计排产数量">
              {getFieldDecorator('planQty', {
                rules: [
                  {
                    required: true,
                    message: '排产数量不能为空',
                  },
                ],
              })(<InputNumber style={{ width: '50%' }} min={0} />)}
            </FormItem>
          )}
          <FormItem label="排产日期">
            {getFieldDecorator('planDate', {
              rules: [
                {
                  required: true,
                  message: '排产日期不能为空',
                },
              ],
            })(<DatePicker style={{ width: '50%' }} format="YYYY-MM-DD" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
