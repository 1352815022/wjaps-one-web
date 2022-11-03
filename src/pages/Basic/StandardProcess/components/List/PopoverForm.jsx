import React, { PureComponent } from 'react';
import { Form, Popover, Button, Row, PageHeader, Input } from 'antd';
import { get } from 'lodash';

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
class FormPopover extends PureComponent {
  state = {
    visible: false,
  };

  handleSave = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      onOk(params, this.handleShowChange);
    });
  };

  handleShowChange = visible => {
    this.setState({
      visible,
    });
  };

  getPopoverContent = () => {
    const { form, width = 400, confirmLoading, title, subTitle, editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div
        style={{
          width,
          overflow: 'hidden',
        }}
      >
        <PageHeader title={title} subTitle={subTitle} />
        <Form {...formItemLayout} layout="horizontal">
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', {
              initialValue: get('id', editData, ''),
            })(<Input />)}
          </FormItem>
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: get('code', editData, ''),
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: get('name', editData, ''),
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <Row
            style={{
              float: 'right',
            }}
          >
            <Button onClick={this.handleSave} loading={confirmLoading} type="primary">
              确定
            </Button>
          </Row>
        </Form>
      </div>
    );
  };

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <Popover
        placement="rightTop"
        content={this.getPopoverContent()}
        onVisibleChange={v => this.handleShowChange(v)}
        trigger="click"
        destroyTooltipOnHide
        visible={visible}
      >
        {children}
      </Popover>
    );
  }
}

export default FormPopover;
