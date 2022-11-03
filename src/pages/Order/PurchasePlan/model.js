/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getColumn, find, saveAll } from './service';
import { constants } from '@/utils';

const { SEARCH_DATE_PERIOD } = constants;

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'purchasePlan',

  state: {
    editData: null,
    modalVisible: false,
    currentViewDate: defaultViewDate,
    viewDateData,
    column: [],
  },
  effects: {
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveAll({ payload }, { call }) {
      const result = yield call(saveAll, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
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
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *getColumn({ payload }, { call, put }) {
      const result = yield call(getColumn, payload);
      const { data, success, message: msg } = result || {};
      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            column: [].concat(data || []),
          },
        });
        message.success(msg);
      } else {
        message.error(msg);
      }
      return data;
    },
    *getData({ payload }, { call }) {
      const result = yield call(find, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
  },
});
