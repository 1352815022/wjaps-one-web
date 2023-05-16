/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import {
  save,
  getEndQtyImportTemplate,
  getPowderImportTemplate,
  importEndQty,
  importPower,
  importNoCalcMaterial,
  getNoCalcMaterialImportTemplate,
} from './service';
import { downFile } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'material',

  state: {
    editData: null,
    modalVisible: false,
    showEndQtyImport: false,
    showPowerImport: false,
    showNoCalcMaterialImport:false
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

    *getEndQtyImportTemplate(_, { call }) {
      const ds = yield call(getEndQtyImportTemplate);
      if (ds.success) {
        downFile(ds.data, '料品上月期末数导入模板.xlsx');
      }
    },

    *getPowderImportTemplate(_, { call }) {
      const ds = yield call(getPowderImportTemplate);
      if (ds.success) {
        downFile(ds.data, '料品喷粉信息导入模板.xlsx');
      }
    },
    *getNoCalcMaterialImportTemplate(_, { call }) {
      const ds = yield call(getNoCalcMaterialImportTemplate);
      if (ds.success) {
        downFile(ds.data, '不计算料号导入模板.xlsx');
      }
    },

    *importEndQty({ payload, callback }, { call }) {
      const result = yield call(importEndQty, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },

    *importPower({ payload, callback }, { call }) {
      const result = yield call(importPower, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *importNoCalcMaterial({ payload, callback }, { call }) {
      const result = yield call(importNoCalcMaterial, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    }
    
  },
});
