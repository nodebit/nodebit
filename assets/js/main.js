import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, Link} from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import Home from './containers/Home'
import Dataset from './containers/Dataset'
import Dashboard from './containers/Dashboard'
import Source from './containers/Source'
import Tab from './containers/Tab'
import Login from './containers/Login'

import {requireAuthentication} from './components/auth'

import app from './reducers'

const store = createStore(
  app,
  applyMiddleware(routerMiddleware(browserHistory))
)

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={requireAuthentication(Home)}/>
      <Route path="/login" component={Login}/>
      <Route path="/source/:id" component={requireAuthentication(Source)}/>
      <Route path="/dataset/:id" component={requireAuthentication(Dataset)}/>
      <Route path="/dashboard/:id" component={requireAuthentication(Dashboard)}/>
      <Route path="/tab/:id" component={requireAuthentication(Tab)}/>
    </Router>
  </Provider>
), document.getElementById('content'))
