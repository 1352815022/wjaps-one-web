/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-30 09:12:01
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, listAllTree, findByTreeNodeId } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'OrganizeProcess',

  state: {
    list: [],
    rowData: null,
    modalVisible: false,
    treeData: [],
    currNode: null,
  },
  effects: {
    *queryTree({ payload }, { call, put }) {
      const result = yield call(listAllTree, payload);
      const { data, success, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: [].concat(data),
          },
        });
      } else {
        message.error(msg);
      }
      return result;
    },
    *updateCurrNode({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *queryListById({ payload }, { call, put }) {
      const result = yield call(findByTreeNodeId, payload);
      const { data, success, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { message: msg, success } = result || {};
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
