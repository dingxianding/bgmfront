import { init, query, remove, add, update, queryCurrent } from '../services/usermng';

export default {
  namespace: 'usermng',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
  },

  effects: {
    *init({ payload }, { call, put }) {
      const response = yield call(init, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    *fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } catch (e) {
        throw e;
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
