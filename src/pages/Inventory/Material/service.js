/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH, LOCAL_PATH } = constants;

const contextPath = '/u9Material';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;

  return request.post(url, data);
}

/** 上月期末数导入模板 */
export async function getEndQtyImportTemplate() {
  const url = `${LOCAL_PATH}/local/materialEndQtyTemplate.xlsx`;
  return request({
    url,
    method: 'GET',
    responseType: 'blob',
  });
}
/** 喷粉导入模板 */
export async function getPowderImportTemplate() {
  const url = `${LOCAL_PATH}/local/materialPowderTemplate.xlsx`;
  return request({
    url,
    method: 'GET',
    responseType: 'blob',
  });
}
/** 导入上月期末数 */
export async function importEndQty(data) {
  const url = `${PROJECT_PATH}/u9Material/uploadEndQty`;
  return request({
    url,
    method: 'post',
    data,
  });
}
/** 导入清洗/喷粉配置 */
export async function importPower(data) {
  const url = `${PROJECT_PATH}/u9Material/uploadPower`;
  return request({
    url,
    method: 'post',
    data,
  });
}
