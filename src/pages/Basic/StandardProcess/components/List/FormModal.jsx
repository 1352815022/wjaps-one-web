import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal, ScrollBar } from 'suid';

const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, save } = this.props;
    console.log(this.props);
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (save) {
        save(formData);
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
    const { id, processGroupName, organizeId, status, remark, byRegion, frozen } = rowData || {};

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
              <FormItem label="工艺">
                {getFieldDecorator('processGroupName', {
                  initialValue: processGroupName,
                  rules: [
                    {
                      required: true,
                      message: '工艺不能为空',
                    },
                  ],
                })(<Input disabled={!!rowData} />)}
              </FormItem>
              <FormItem label="组织ID">
                {getFieldDecorator('organizeId', {
                  initialValue: organizeId,
                })(<Input disabled={saving} />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  initialValue: status,
                })(<Input disabled={saving} />)}
              </FormItem>
              <FormItem label="备注">
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input disabled={saving} />)}
              </FormItem>
              <FormItem label="按区域排产">
                {getFieldDecorator('byRegion', {
                  initialValue: byRegion,
                  valuePropName: 'checked',
                })(<Switch disabled={saving} />)}
              </FormItem>

              <FormItem label="冻结">
                {getFieldDecorator('frozen', {
                  initialValue: frozen,
                  valuePropName: 'checked',
                })(<Switch disabled={saving} />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
