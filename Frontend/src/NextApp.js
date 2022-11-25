import React from "react";
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import {Route, Switch} from "react-router-dom";
import "assets/vendors/style";
import "styles/wieldy.less";

import configureStore, { history } from './appRedux/store';
import App from "./containers/App/index";

const store = configureStore();

const NextApp = () =>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </ConnectedRouter>
  </Provider>;


export default NextApp;
