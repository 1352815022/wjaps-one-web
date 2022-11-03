/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-28 14:37:45
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;
// const MockServerPath = 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const masterPath = '/apsOrganize';
const minorPath = '/apsOrganizeProcessId';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${minorPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${minorPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 获取所有树结构数据
 */
export async function listAllTree(params = {}) {
  const url = `${PROJECT_PATH}${masterPath}/findOrgTree`;
  return request.get(url, params);
}

/**
 * 根据树节点id获取表格数据
 */
export async function findByTreeNodeId(params = {}) {
  const url = `${PROJECT_PATH}${minorPath}/findByPage`;
  return request({
    url,
    method: 'POST',
    params,
  });
}
