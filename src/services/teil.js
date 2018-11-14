import { stringify } from 'qs';
import request from '../utils/request';

export async function init(params) {
  return request(`/myapi/teil/init?${stringify(params)}`);
}

export async function query(params) {
  return request(`/myapi/teil/pagedList?${stringify(params)}`);
}

export async function initAll(params) {
  return request(`/myapi/teil/initAll?${stringify(params)}`);
}

export async function queryAll(params) {
  return request(`/myapi/teil/pagedListAll?${stringify(params)}`);
}

export async function getById({ id }) {
  return request(`/myapi/teil/${id}`);
}

export async function add(params) {
  return request('/myapi/teil', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function remove({ id }) {
  return request(`/myapi/teil/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/myapi/teil', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}

// 获取表头，只有表头
export async function queryHeader(params) {
  return request(`/datapack/header/${params.dataId}`);
}

// 获取分页数据，只有数据，不包括表头
export async function queryData(params) {
  return request(`/datapack/pageData?${stringify(params)}`);
}

// 获取图数据
export async function queryChartData(params) {
  return request(`/datapack/columnData?${stringify(params)}`);
}

export async function queryDatapack() {
  return request('/datapack/level/0');
}

export async function remove0(params) {
  return request('/teil/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function add0(params) {
  return request('/teil/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
