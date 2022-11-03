/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;

/** 根据条件查找组织 */
export async function findOrgsByFilter(data) {
  const url = `${PROJECT_PATH}/apsOrganize/findByFilter`;
  return request.post(url, data);
}
