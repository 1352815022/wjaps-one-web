/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:49:29
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;
// const MockServerPath =
//   'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const serverPath = `${PROJECT_PATH}`;
// const parentPath = '/u9Material';
const childPath = '/apsProcessMaterial';

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${serverPath}/${childPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除子表格数据 */
export async function delChildRow(params) {
  const url = `${serverPath}/${childPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
