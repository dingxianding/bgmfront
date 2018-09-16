import {
  queryRule,
  removeRule,
  addRule,
  queryDatapack,
  queryData,
  queryHeader,
  queryChartData,
} from '../services/dataview';

export default {
  namespace: 'dataview',

  //初始化state
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //包括表头和数据
    *fetchHeaderData({ payload }, { call, put }) {
      const responseHeader = yield call(queryHeader, payload);
      yield put({
        type: 'saveHeader',
        payload: responseHeader,
      });
      const response = yield call(queryData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //只获取表格数据
    *fetchData({ payload }, { call, put }) {
      const response = yield call(queryData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //获取图数据
    *fetchChartData({ payload }, { call, put }) {
      const response = yield call(queryChartData, payload);
      yield put({
        type: 'saveChartData',
        payload: response,
      });
    },
    *fetchdb({ payload }, { call, put }) {
      const response = yield call(queryDatapack, payload);
      //处理返回的结果，参考mock/rule.js的getRule()
      let pageSize = 10;
      const result = {
        list: response,
        pagination: {
          total: response.length,
          pageSize,
          current: 1,
        },
      };

      yield put({
        type: 'save',
        payload: result,
      });
    },
    //*fetch + yield这种写法是为了使异步执行的方法同步执行
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload); //以异步的方式调用函数queryRule，response是返回结果？？？
      yield put({
        type: 'save',
        payload: response, //触发reducer中的save这个action，修改state
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    //修改state
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveHeader(state, action) {
      return {
        ...state,
        header: action.payload,
      };
    },
    saveChartData(state, action) {
      return {
        ...state,
        chartData: action.payload,
      };
    },
    clear() {
      return {
        offlineData: [],
        offlineChartData: [],
      };
    },
  },
};
