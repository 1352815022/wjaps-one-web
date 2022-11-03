import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { ExtModal, ComboList, ScopeDatePicker } from 'suid';
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
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        const count = params.workHour + params.overTimeHour;
        if (count > 24) {
          message.error('标准工作时长 + 加班时长超过24小时');
          return;
        }
        [params.effectiveFrom, params.effectiveTo] = params.scopeDate;
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('organizeId', { initialValue: editData && editData.organizeId });
    const title = '批量新增';

    const getOrgComboListProps = () => {
      return {
        form,
        name: 'apsOrganizeName',
        field: ['organizeId'],
        store: {
          url: `${PROJECT_PATH}/apsOrganize/getLinesWithoutFrozen`,
          type: 'GET',
          params: {
            dictCode: 'Organization',
          },
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
          <FormItem label="生产线">
            {getFieldDecorator('apsOrganizeName', {
              initialValue: editData && editData.apsOrganizeName,
              rules: [
                {
                  required: true,
                  message: '生产线不能为空',
                },
              ],
            })(<ComboList {...getOrgComboListProps()} />)}
          </FormItem>
          <FormItem label="日期范围">
            {getFieldDecorator('scopeDate', {
              rules: [
                {
                  required: true,
                  message: '上班日期不能为空',
                },
              ],
            })(<ScopeDatePicker allowClear="true" format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="标准上班时长">
            {getFieldDecorator('workHour', {
              initialValue: editData && editData.workHour,
              rules: [
                {
                  required: true,
                  message: '标准上班时长不能为空',
                },
              ],
            })(<InputNumber min={0} max={24} precision={1} step={0.5} />)}
          </FormItem>
          <FormItem label="加班时长">
            {getFieldDecorator('overTimeHour', {
              initialValue: editData && editData.overTimeHour,
              rules: [
                {
                  required: true,
                  message: '加班时长不能为空',
                },
              ],
            })(<InputNumber min={0} max={24} precision={1} step={0.5} />)}
          </FormItem>
          <FormItem label="人数">
            {getFieldDecorator('numOfPeople', {
              initialValue: editData && editData.numOfPeople,
              rules: [
                {
                  required: true,
                  message: '人数不能为空',
                },
              ],
            })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
