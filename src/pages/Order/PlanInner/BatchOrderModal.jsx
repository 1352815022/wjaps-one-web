import React, { PureComponent } from 'react';
import { DatePicker, Form } from 'antd';
import { ExtModal, ComboList } from 'suid';

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
class BatchOrderModal extends PureComponent {
  state = {
    parentId: null,
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
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      if (params.planStartDate) {
        params.planStartDate = params.planStartDate.format('YYYY-MM-DD');
      }

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

  handleWorkgroupSelected = item => {
    this.workLineRef.onClearValue();
    this.setState({
      parentId: item.id,
    });
  };

  render() {
    const { form, onClose, saving, visible, workGroups, workLines } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('workGroupId');
    getFieldDecorator('workLineId');
    getFieldDecorator('planTypeCode', { initialValue: 'byCapacity' });
    const title = '批量下达';

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
            })(<DatePicker />)}
          </FormItem>

          <FormItem label="车间">
            {getFieldDecorator('workGroupName', {
              rules: [
                {
                  required: true,
                  message: '车间不能为空',
                },
              ],
            })(
              <ComboList
                form={form}
                dataSource={workGroups}
                name="workGroupName"
                field={['workGroupId']}
                afterSelect={this.handleWorkgroupSelected}
                reader={{
                  name: 'name',
                  field: ['id'],
                }}
              />,
            )}
          </FormItem>
          <FormItem label="班组">
            {getFieldDecorator('workLineName', {
              rules: [
                {
                  required: false,
                  message: '班组不能为空',
                },
              ],
            })(
              <ComboList
                form={form}
                ref={inst => (this.workLineRef = inst)}
                dataSource={workLines.filter(v => {
                  if (v.parentId === this.state.parentId) {
                    return true;
                  }
                  return false;
                })}
                name="workLineName"
                field={['workLineId']}
                reader={{
                  name: 'name',
                  field: ['id'],
                }}
              />,
            )}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default BatchOrderModal;
