/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:49:29
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
const { request } = utils;

const contextPath = '/apsReport';

export async function calcOweMaterial(data) {
  const url = `${PROJECT_PATH}${contextPath}/calcOweMaterial`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

export async function getDynamicCols(data) {
  const url = `${PROJECT_PATH}${contextPath}/getCols`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
