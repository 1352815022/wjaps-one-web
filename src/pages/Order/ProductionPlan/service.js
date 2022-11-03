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
// const MockServerPath = 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const contextPath = '/apsOrderPlan';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/savePlan`;

  return request.post(url, data);
}
/** 保存 */
export async function saveAll(data) {
  const url = `${PROJECT_PATH}${contextPath}/saveAllPlan`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}

/** 获取动态列 */
export async function getColumn(params) {
  const url = `${PROJECT_PATH}${contextPath}/getCols`;
  return request.get(url, params);
}

/** 获取table数据 */
export async function find(data) {
  const url = `${PROJECT_PATH}${contextPath}/find`;
  // console.log(data)
  return request.post(url, data);
}

/** 根据条件查找组织 */
export async function findOrgsByFilter(data) {
  const url = `${PROJECT_PATH}/apsOrganize/findByFilter`;
  return request.post(url, data);
}
