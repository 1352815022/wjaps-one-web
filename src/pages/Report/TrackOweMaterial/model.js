/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-30 09:19:56
 */
import { message } from 'antd';
import { utils } from 'suid';
import { getDynamicCols, calcOweMaterial } from './service';
import { constants } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const { SEARCH_DATE_PERIOD } = constants;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'trackOweMaterial',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    currentViewDate: defaultViewDate,
    viewDateData,
    dynamicCol: [],
  },
  effects: {
    *getDynamicCols({ payload }, { call }) {
      const result = yield call(getDynamicCols, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
    *calcOweMaterial({ payload }, { call }) {
      const result = yield call(calcOweMaterial, payload);
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
