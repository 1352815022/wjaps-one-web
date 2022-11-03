/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { SEARCH_DATE_PERIOD } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const viewDateData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const [defaultViewDate] = viewDateData;

export default modelExtend(model, {
  namespace: 'allOrder',

  state: {
    currentViewDate: defaultViewDate,
    viewDateData,
  },
  effects: {},
});
