import { init, query, remove, add, update, getById } from '../services/modell';

export default {
  namespace: 'modell',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    profile: {},
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
    *getById({ payload }, { call, put }) {
      const response = yield call(getById, payload);
      yield put({
        type: 'saveProfile',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(add, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(remove, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(update, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveProfile(state, action) {
      return {
        ...state,
        profile: action.payload,
      };
    },
  },
};
