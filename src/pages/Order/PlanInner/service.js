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
const contextPath = '/apsOrder';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}
/** 根据条件查找组织 */
export async function findOrgsByFilter(data) {
  const url = `${PROJECT_PATH}/apsOrganize/findByFilter`;
  return request.post(url, data);
}
/** 内部待排下达 */
export async function orderPlan(data) {
  const url = `${PROJECT_PATH}${contextPath}/plan`;
  return request.post(url, data);
}
/** 组件拆分 */
export async function orderSplit(data) {
  const url = `${PROJECT_PATH}${contextPath}/splitAndMerge`;
  return request.post(url, data);
}
/** 批量下达 */
export async function batchPlan(data) {
  const url = `${PROJECT_PATH}${contextPath}/batchPlan`;
  return request.post(url, data);
}
/** 修改内排单据状态 cancel 取消 or stop 暂停 */
export async function changeStatus(data) {
  const url = `${PROJECT_PATH}${contextPath}/changeOrderStatus`;
  return request.post(url, data);
}
