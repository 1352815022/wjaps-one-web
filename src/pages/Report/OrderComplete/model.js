/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-30 09:19:56
 */

import { utils } from 'suid';

import { constants } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const { SEARCH_DATE_PERIOD } = constants;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'orderComplete',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    currentViewDate: defaultViewDate,
    viewDateData,
  },
  effects: {},
});
