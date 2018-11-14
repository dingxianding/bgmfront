import { stringify } from 'qs';
import request from '../utils/request';

export async function init(params) {
  return request(`/myapi/users/pagedList?${stringify(params)}`);
}

export async function query(params) {
  return request(`/myapi/users/pagedList?${stringify(params)}`);
}

export async function add(params) {
  return request('/myapi/users', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function remove({ id }) {
  return request(`/myapi/users/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/myapi/users', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}

// 登录
export async function accountLogin(params) {
  return request('/myapi/users/login', {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrent() {
  return request('/myapi/users/current');
}
