import {init, query, remove, add, update, getById} from '../services/teil';

export default {
  namespace: 'teil',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    profile: {},
  },

  effects: {
    * init({payload}, {call, put}) {
      const response = yield call(init, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetch({payload}, {call, put}) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * getById({payload}, {call, put}) {
      const response = yield call(getById, payload);
      yield put({
        type: 'saveProfile',
        payload: response,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(add, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(remove, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
    * update({payload, callback}, {call, put}) {
      const response = yield call(update, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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
