/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, findOrgsByFilter, orderPlan, batchPlan, changeStatus } from './service';
import { constants } from '@/utils';

const { SEARCH_DATE_PERIOD } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'planInner',

  state: {
    editData: null,
    modalVisible: false,
    orderPlanModalVisible: false,
    batchOrderModalVisible: false,
    currentViewDate: defaultViewDate,
    viewDateData,
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
    *findOrgsByFilter({ payload }, { call }) {
      const result = yield call(findOrgsByFilter, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        // message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *orderPlan({ payload }, { call }) {
      const result = yield call(orderPlan, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *batchPlan({ payload }, { call }) {
      const result = yield call(batchPlan, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
    *changStatus({ payload }, { call }) {
      const result = yield call(changeStatus, payload);
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
