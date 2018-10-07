import { stringify } from 'qs';
import request from '../utils/request';

export async function init(params) {
  return request(`/myapi/teiltest/init?${stringify(params)}`);
}

export async function query(params) {
  return request(`/myapi/teiltest/pagedList?${stringify(params)}`);
}

export async function add(params) {
  return request('/myapi/teiltest', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function remove({ id }) {
  return request(`/myapi/teiltest/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/myapi/teiltest', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
