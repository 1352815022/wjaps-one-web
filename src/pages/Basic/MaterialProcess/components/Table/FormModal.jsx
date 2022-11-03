import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal, ScrollBar, ComboList } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  state = {
    apsProcessDto: null,
  };

  onFormSubmit = () => {
    const { form, onSave, pRowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        const thatFormData = formData;
        thatFormData.apsProcessDto = this.state.apsProcessDto;
        thatFormData.apsProcessGroupDto = pRowData;
        onSave(thatFormData);
      }
    });
  };

  getComboListProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'apsProcessProcessName',
      field: ['processId'],
      store: {
        url: `${PROJECT_PATH}/apsProcess/findByPage`,
        type: 'POST',
      },
      rowKey: 'id',
      reader: {
        name: 'processName',
        field: ['id'],
      },
    };
  };

  render() {
    console.log(this.props);
    const { form, saving, visible, onCancel, pRowData, rowData } = this.props;
    const { getFieldDecorator } = form;

    getFieldDecorator('processId', { initialValue: rowData && rowData.processId });
    getFieldDecorator('materialId', { initialValue: pRowData && pRowData.id });
    getFieldDecorator('organizeId', { initialValue: rowData && rowData.organizeId });
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const title = rowData ? '编辑' : '新建';

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
                  initialValue: rowData && rowData.id,
                })(<Input />)}
              </FormItem>
              <FormItem label="工序">
                {getFieldDecorator('apsProcessProcessName', {
                  initialValue: rowData && rowData.apsProcessProcessName,
                  rules: [
                    {
                      required: true,
                      message: '工序不能为空',
                    },
                  ],
                })(<ComboList {...this.getComboListProps()} />)}
              </FormItem>

              <FormItem label="冻结">
                {getFieldDecorator('frozen', {
                  initialValue: rowData && rowData.frozen,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
