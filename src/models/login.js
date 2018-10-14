import {routerRedux} from 'dva/router';
import Cookies from 'universal-cookie';
import {stringRole} from '../utils/utils';
import {accountLogin} from '../services/usermng';
import {setAuthority} from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';

const cookies = new Cookies();

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({payload}, {call, put}) {
      try {
        const {username, password, autoLogin} = payload;
        const response = yield call(accountLogin, {username, password});
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            status: true,
          },
        });
        // Login successfully
        reloadAuthorized();
        if (autoLogin) {
          window.localStorage.setItem('access_token', response.access_token);
          window.localStorage.setItem('myId', response.id);
        } else {
          cookies.set('access_token', response.access_token, {path: '/'});
          window.sessionStorage.setItem('access_token', response.access_token);
          window.localStorage.setItem('myId', response.id);
        }
        yield put(routerRedux.replace('/'));
      } catch (e) {
        throw e;
      }
    },
    * logout(_, {put}) {
      window.localStorage.clear();
      window.sessionStorage.clear();
      cookies.remove('access_token');
      try {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            role: 'guest',
          },
        });
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            // search: stringify({
            //   redirect: window.location.href,
            // }),
          }),
        );
      } catch (e) {
        throw e;
      }
    },
  },

  reducers: {
    changeLoginStatus(
      state,
      {
        payload: {role, status, type},
      },
    ) {
      const setRole = stringRole(role);
      setAuthority(setRole);
      return {
        ...state,
        status,
        type,
      };
    },
  },
};
