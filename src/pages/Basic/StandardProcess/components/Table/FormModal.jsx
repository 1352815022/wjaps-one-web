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
      name: 'processName',
      field: ['processName'],
      store: {
        url: `${PROJECT_PATH}/apsProcess/findByPage`,
        type: 'POST',
      },
      rowKey: 'id',
      reader: {
        name: 'processName',
        field: ['processName'],
      },
      afterSelect: item => {
        this.setState({
          apsProcessDto: item,
        });
      },
    };
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
    const {
      id,
      apsProcessDto,
      schedulingFlag,
      personFlag,
      acquisitionFlag,
      acquisitionTimes,
      productionFlag,
      processingTimes,
      outputType,
      processPriority,
      productionProcessId,
      remark,
      fixDay,
      postConstraint,
      extraYield,
      frozen,
    } = rowData || {};

    const { processName } = apsProcessDto || {};

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
              <FormItem label="工序">
                {getFieldDecorator('processName', {
                  initialValue: processName,
                  rules: [
                    {
                      required: true,
                      message: '工序不能为空',
                    },
                  ],
                })(<ComboList {...this.getComboListProps()} />)}
              </FormItem>
              <FormItem label="是否排产">
                {getFieldDecorator('schedulingFlag', {
                  initialValue: schedulingFlag,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="是否采集">
                {getFieldDecorator('acquisitionFlag', {
                  initialValue: acquisitionFlag,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="是否报产">
                {getFieldDecorator('productionFlag', {
                  initialValue: productionFlag,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="记录报产人">
                {getFieldDecorator('personFlag', {
                  initialValue: personFlag,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="采集次数">
                {getFieldDecorator('acquisitionTimes', {
                  initialValue: acquisitionTimes,
                })(<Input />)}
              </FormItem>
              <FormItem label="加工次数">
                {getFieldDecorator('processingTimes', {
                  initialValue: processingTimes,
                })(<Input />)}
              </FormItem>
              <FormItem label="优先级">
                {getFieldDecorator('processPriority', {
                  initialValue: processPriority,
                })(<Input />)}
              </FormItem>
              <FormItem label="报产来源">
                {getFieldDecorator('productionProcessId', {
                  initialValue: productionProcessId,
                })(<Input />)}
              </FormItem>
              <FormItem label="备注">
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input />)}
              </FormItem>
              <FormItem label="报产方式">
                {getFieldDecorator('outputType', {
                  initialValue: outputType,
                })(<Input />)}
              </FormItem>
              <FormItem label="提前期">
                {getFieldDecorator('fixDay', {
                  initialValue: fixDay,
                })(<Input />)}
              </FormItem>
              <FormItem label="后端约束">
                {getFieldDecorator('postConstraint', {
                  initialValue: postConstraint,
                })(<Input />)}
              </FormItem>
              <FormItem label="额外报产">
                {getFieldDecorator('extraYield', {
                  initialValue: extraYield,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
              <FormItem label="冻结">
                {getFieldDecorator('frozen', {
                  initialValue: frozen,
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
