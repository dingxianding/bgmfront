import { stringify } from 'qs';
import request from '../utils/request';

//获取表头，只有表头
export async function queryHeader(params) {
  return request(`/datapack/header/${params.dataId}`);
}

//获取分页数据，只有数据，不包括表头
export async function queryData(params) {
  return request(`/datapack/pageData?${stringify(params)}`);
}

//获取图数据
export async function queryChartData(params) {
  return request(`/datapack/columnData?${stringify(params)}`);
}

export async function queryDatapack() {
  return request('/datapack/level/0');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
