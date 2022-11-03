import React, { PureComponent } from 'react';
import { Form, Input, Switch, DatePicker } from 'antd';
import { ExtModal, ComboTree } from 'suid';
import moment from 'moment';
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
    apsOrganizeDto: null,
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
        params.apsOrganizeDto = this.state.apsOrganizeDto;
        params.startDate = params.startDate.format('YYYY-MM-DD hh:mm:ss');
        params.endDate = params.endDate.format('YYYY-MM-DD hh:mm:ss');
        onSave(params);
      }
    });
  };

  getComboTreeProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'organizeName',
      store: {
        url: `${PROJECT_PATH}/apsOrganize/findOrgTreeWithoutFrozen`,
        type: 'GET',
      },
      reader: {
        name: 'name',
      },
      afterSelect: item => {
        this.setState({
          apsOrganizeDto: item,
        });
      },
    };
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const { apsOrganizeDto } = editData || {};
    const title = editData ? '编辑' : '新增';

    this.setState({
      apsOrganizeDto,
    });

    // console.log(moment(editData.endDate))
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
          {/* <FormItem label="组织">
            {getFieldDecorator('organizeName', {
              initialValue: apsOrganizeDto && apsOrganizeDto.name,
              rules: [
                {
                  required: true,
                  message: '组织不能为空',
                },
              ],
            })(<ComboTree {...this.getComboTreeProps()} />)}
          </FormItem> */}
          <FormItem label="假期名称">
            {getFieldDecorator('holidayName', {
              initialValue: editData && editData.holidayName,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="开始日期">
            {getFieldDecorator('startDate', {
              initialValue: editData && moment(editData.startDate),
              rules: [
                {
                  required: true,
                  message: '开始日期不能为空',
                },
              ],
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="结束日期">
            {getFieldDecorator('endDate', {
              initialValue: editData && moment(editData.endDate),
              rules: [
                {
                  required: true,
                  message: '结束日期不能为空',
                },
              ],
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input />)}
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
