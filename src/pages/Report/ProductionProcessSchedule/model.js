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
  namespace: 'productionProcessSchedule',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    currentViewDate: defaultViewDate,
    viewDateData,
    dynamicCol: [
      {
        title: '工序1',
        dataIndex: 'process1',
        width: 100,
      },
      {
        title: '工序2',
        dataIndex: 'process2',
        width: 100,
      },
      {
        title: '工序3',
        dataIndex: 'process3',
        width: 100,
      },
      {
        title: '工序4',
        dataIndex: 'process4',
        width: 100,
      },
      {
        title: '工序5',
        dataIndex: 'process5',
        width: 100,
      },
      {
        title: '工序6',
        dataIndex: 'process6',
        width: 100,
      },
      {
        title: '工序7',
        dataIndex: 'process7',
        width: 100,
      },
      {
        title: '工序8',
        dataIndex: 'process8',
        width: 100,
      },
      {
        title: '工序9',
        dataIndex: 'process9',
        width: 100,
      },
      {
        title: '工序10',
        dataIndex: 'process10',
        width: 100,
      },
      {
        title: '工序11',
        dataIndex: 'process11',
        width: 100,
      },
      {
        title: '工序12',
        dataIndex: 'process12',
        width: 100,
      },
      {
        title: '工序13',
        dataIndex: 'process13',
        width: 100,
      },
      {
        title: '工序14',
        dataIndex: 'process14',
        width: 100,
      },
      {
        title: '工序15',
        dataIndex: 'process15',
        width: 100,
      },
      {
        title: '工序16',
        dataIndex: 'process16',
        width: 100,
      },
      {
        title: '工序17',
        dataIndex: 'process17',
        width: 100,
      },
      {
        title: '工序18',
        dataIndex: 'process18',
        width: 100,
      },
      {
        title: '工序19',
        dataIndex: 'process19',
        width: 100,
      },
      {
        title: '工序20',
        dataIndex: 'process20',
        width: 100,
      },
      {
        title: '工序21',
        dataIndex: 'process21',
        width: 100,
      },
      {
        title: '工序22',
        dataIndex: 'process22',
        width: 100,
      },
      {
        title: '工序23',
        dataIndex: 'process23',
        width: 100,
      },
      {
        title: '工序24',
        dataIndex: 'process24',
        width: 100,
      },
      {
        title: '工序25',
        dataIndex: 'process25',
        width: 100,
      },
      {
        title: '工序26',
        dataIndex: 'process26',
        width: 100,
      },
      {
        title: '工序27',
        dataIndex: 'process27',
        width: 100,
      },
      {
        title: '工序28',
        dataIndex: 'process28',
        width: 100,
      },
      {
        title: '工序29',
        dataIndex: 'process29',
        width: 100,
      },
      {
        title: '工序30',
        dataIndex: 'process30',
        width: 100,
      },
    ],
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
