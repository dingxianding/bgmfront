import { routerRedux } from 'dva/router';
import Cookies from 'universal-cookie';
import { register } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

const cookies = new Cookies();

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(register, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        cookies.set('access_token', response.access_token, { path: '/' });
        window.localStorage.setItem('myId', response.id);
        yield put(routerRedux.replace('/'));
      } catch (e) {
        throw e;
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('guest');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
