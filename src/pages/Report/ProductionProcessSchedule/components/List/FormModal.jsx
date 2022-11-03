import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal, ScrollBar } from 'suid';

const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, osSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (osSave) {
        osSave(formData);
      }
    });
  };

  render() {
    const { form, saving, visible, onCancel, rowData } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const title = rowData ? '编辑' : '新建';
    const { id, code, name } = rowData || {};

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        title={title}
        onOk={() => {
          this.onFormSubmit();
        }}
        width={550}
        okText="保存"
      >
        <div>
          <ScrollBar>
            <Form style={{ padding: '0 10px' }} {...formItemLayout} layout="horizontal">
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input />)}
              </FormItem>
              <FormItem label="代码">
                {getFieldDecorator('code', {
                  initialValue: code,
                  rules: [
                    {
                      required: true,
                      message: '代码不能为空',
                    },
                  ],
                })(<Input disabled={!!rowData} />)}
              </FormItem>
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [
                    {
                      required: true,
                      message: '名称不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
