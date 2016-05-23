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

io.socket.on('message', function (data) {
  console.log("got message", store)
  if (window.location.pathname.indexOf("/tab/") != -1) {
    /// check to see whether we should push data to tab or dataset
    if (typeof data.list !== "undefined") {
      store.dispatch({type: "REPLACE_TAB_DATASET_DATA", data: data.list, room_id: data.room_id})
    } else if (typeof data.error !== "undefined") {
      store.dispatch({type: "ERROR_TAB_DATASET_DATA", data: data.error, room_id: data.room_id})
    } else if (typeof data.data !== "undefined") {
      store.dispatch({type: "STREAM_TAB_DATASET_DATA", data: data.data, room_id: data.room_id})
    }
  } else {
    if (typeof data.list !== "undefined") {
      store.dispatch({type: "REPLACE_DATASET_DATA", data: data.list})
    } else if (typeof data.error !== "undefined") {
      store.dispatch({type: "ERROR_DATASET_DATA", data: data.error})
    } else if (typeof data.data !== "undefined") {
      store.dispatch({type: "STREAM_DATASET_DATA", data: data.data})
    }
  }
})

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
