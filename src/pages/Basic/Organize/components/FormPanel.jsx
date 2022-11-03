import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, InputNumber, Button } from 'antd';
import { connect } from 'dva';
import { ComboList, ScrollBar } from 'suid';
import { constants } from '@/utils';

const FormItem = Form.Item;
const buttonWrapper = { span: 18, offset: 6 };
const { SERVER_PATH } = constants;

@connect(({ organize, loading }) => ({ organize, loading }))
@Form.create()
class FormModal extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { form, organize, isCreate } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      const selectedTreeNode = organize.selectedTreeNode || {};
      if (isCreate) {
        Object.assign(params, { parentId: selectedTreeNode.id });
      } else {
        Object.assign(params, selectedTreeNode);
      }
      Object.assign(params, formData);
      this.save(params);
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organize/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'organize/queryTree',
        });
      }
    });
  };

  render() {
    const { form, organize, isCreate } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: isCreate ? 18 : 10,
      },
    };
    let tempSelectedNode = organize.selectedTreeNode || {};
    if (isCreate) {
      tempSelectedNode = { parentName: tempSelectedNode.name };
    }

    const getComboListProps = () => {
      return {
        form,
        name: 'category',
        field: ['category'],
        store: {
          url: `${SERVER_PATH}/dms/dataDict/getCanUseDataDictValues`,
          type: 'GET',
          params: {
            dictCode: 'Organization',
          },
        },
        reader: {
          name: 'dataValue',
          description: 'dataName',
        },
      };
    };

    const {
      code = '',
      namePath = '',
      name = '',
      shortName = '',
      rank = '',
      category = '',
      frozen = false,
    } = tempSelectedNode;

    return (
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: code,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="节点链路">
            {getFieldDecorator('namePath', {
              initialValue: namePath,
            })(<Input disabled />)}
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
          <FormItem label="组织类型">
            {getFieldDecorator('category', {
              initialValue: category,
              rules: [
                {
                  required: true,
                  message: '组织类型不能为空',
                },
              ],
            })(<ComboList {...getComboListProps()} />)}
          </FormItem>
          <FormItem label="简称">
            {getFieldDecorator('shortName', {
              initialValue: shortName,
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: rank,
              rules: [
                {
                  required: true,
                  message: '序号不能为空',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} precision={0} />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: frozen,
            })(<Checkbox />)}
          </FormItem>
          {!isCreate ? (
            <FormItem wrapperCol={buttonWrapper}>
              <Button type="primary" onClick={this.onFormSubmit}>
                确定
              </Button>
            </FormItem>
          ) : null}
        </Form>
      </ScrollBar>
    );
  }
}

export default FormModal;
