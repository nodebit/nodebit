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

import app from './reducers'

const store = createStore(
  app,
  applyMiddleware(routerMiddleware(browserHistory))
)

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Home}/>
      <Route path="/dataset/:id" component={Dataset}/>
      <Route path="/dashboard/:id" component={Dashboard}/>
      <Route path="/source/:id" component={Source}/>
    </Router>
  </Provider>
), document.getElementById('content'))
