import {stringify} from 'qs';
import request from '../utils/request';

export async function init(params) {
  return request(`/myapi/modell/init?${stringify(params)}`);
}

export async function query(params) {
  return request(`/myapi/modell/pagedList?${stringify(params)}`);
}

export async function add(params) {
  return request('/myapi/modell', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function remove({id}) {
  return request(`/myapi/modell/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/myapi/modell', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
