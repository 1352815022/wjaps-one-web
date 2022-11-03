/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-30 09:13:41
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, getTree, save } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'organize',

  state: {
    treeData: [],
    rowData: null,
    showCreateModal: false,
    selectedTreeNode: null,
  },
  effects: {
    *queryTree({ payload }, { call, put }) {
      const result = yield call(getTree, payload);
      const { success, message: msg, data } = result || {};

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: [].concat(data || []),
          },
        });
      } else {
        message.error(msg);
      }
      return result;
    },
    *save({ payload }, { call, put }) {
      const result = yield call(save, payload);
      const { success, message: msg, data } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
        yield put({
          type: 'updateState',
          payload: {
            showCreateModal: false,
            selectedTreeNode: data,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('删除成功');
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
