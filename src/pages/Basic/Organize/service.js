/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-12 16:55:34
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
const { request } = utils;
// const MockServerPath = 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const contextPath = '/apsOrganize';

/** 获取树 */
export async function getTree() {
  // const url = `${PROJECT_PATH}${contextPath}/getAllRootNode`;
  const url = `${PROJECT_PATH}${contextPath}/findOrgTree`;
  return request({
    url,
    method: 'GET',
  });
}

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
