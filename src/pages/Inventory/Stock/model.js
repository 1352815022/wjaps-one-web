/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, exportData } from './service';
import { exportXlsx } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'stock',

  state: {
    editData: null,
    modalVisible: false,
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
    *exportData(_, { call }) {
      const ds = yield call(exportData);
      if (ds.success) {
        if (ds.data && ds.data.length > 0) {
          exportXlsx(
            'U9库存',
            [
              '物料编码',
              '物料名称',
              '物料规格',
              '库存可用量',
              '预留数量',
              '实际库存',
              '单位',
              '仓库编码',
              '仓库名称',
            ],
            ds.data,
          );
        } else {
          message.destroy();
          message.info('没找到数据');
        }
      }
    },
  },
});
