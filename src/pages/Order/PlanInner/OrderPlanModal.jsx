import React, { PureComponent } from 'react';
import { Form, Input, DatePicker,InputNumber } from 'antd';
import { ComboList, ExtModal } from 'suid';
import moment from 'moment';
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
    nowPlanType: 'byCapacity',
    planType: [
      {
        id: 2,
        code: 'byCapacity',
        name: '按照产能下达',
      },
      {
        id: 1,
        code: 'byDate',
        name: '按照日期下达',
      },
    ],
  };

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (params.planStartDate) {
        params.planStartDate = params.planStartDate.format('YYYY-MM-DD');
      }
      //params.planQty = params.noPlanQty;
      // console.log(params);
      if (onSave) {
        onSave(params);
      }
    });
  };

  handlePlanTypeSelected = item => {
    this.setState({
      nowPlanType: item.code,
    });
  };
   disabledDate(current) {
    return current && current < moment().subtract(1, 'days').endOf('day')
  }

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = '下达';
    getFieldDecorator('planTypeCode', { initialValue: 'byCapacity' });

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
          <FormItem label="下达类型">
            <ComboList
              form={form}
              dataSource={this.state.planType}
              name="name"
              field={['planTypeCode']}
              defaultValue="按照产能下达"
              afterSelect={this.handlePlanTypeSelected}
              reader={{
                name: 'name',
                field: ['code'],
              }}
            />
          </FormItem>
          <FormItem label="下达日期">
            {getFieldDecorator('planStartDate', {
              rules: [
                {
                  required: this.state.nowPlanType === 'byDate',
                  message: '下达日期',
                },
              ],
            })(<DatePicker disabledDate={this.disabledDate}/>)}
          </FormItem>
          <FormItem label="下达数量">
            {getFieldDecorator('planQty', {
              initialValue: editData && editData.noPlanQty,
            })(<InputNumber max={editData.noPlanQty}   />)}
          </FormItem>
      
          <FormItem label="订单号">
            {getFieldDecorator('orderNo', {
              initialValue: editData && editData.orderNo,
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
