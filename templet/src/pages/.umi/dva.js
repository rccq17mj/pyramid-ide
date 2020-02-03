import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'global', ...(require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/models/global.ts').default) });
app.model({ namespace: 'login', ...(require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/models/login.ts').default) });
app.model({ namespace: 'setting', ...(require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/models/setting.ts').default) });
app.model({ namespace: 'user', ...(require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/models/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
