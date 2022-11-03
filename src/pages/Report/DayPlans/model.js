/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { findOrgsByFilter } from './service';
import { constants } from '@/utils';

const { SEARCH_DATE_PERIOD } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'dayPlans',

  state: {
    currentViewDate: defaultViewDate,
    viewDateData,
  },
  effects: {
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
  },
});
