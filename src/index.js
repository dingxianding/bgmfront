import './polyfill';
import dva from 'dva';
import { notification } from 'antd';
import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    e.preventDefault();
    if (e.name === 500 && e.code === 1001) {
      app._store.dispatch({ type: 'login/logout' }); // eslint-disable-line
    } else {
      notification.error({
        message: `操作失败(${e.code})`,
        description: e.message,
      });
      if (e.name === 500 && e.code > 1001 && e.code <= 1006) {
        app._store.dispatch({ type: 'login/logout' }); // eslint-disable-line
      }
    }
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
