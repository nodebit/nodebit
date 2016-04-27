import {combineReducers} from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

function dashboards(state = [], action) {
  switch(action.type) {
    case 'RECIEVE_DASHBOARDS':
      // this returning action dashboards may be horrific because of the mutations state thign
      return action.dashboards
    default:
      return state
  }
}

function dashboard(state = {}, action) {
  switch(action.type) {
    case 'RECIEVE_DASHBOARD':
      return action.dashboard
    case 'AWAITING_DASHBOARD':
      return {}
    case 'RECIEVE_UPDATE_DASHBOARD':
      return Object.assign({}, state, action.dashboard)
    case 'UNMOUNT_DASHBOARD':
      return {}
    default:
      return state
  }
}

function datasets(state = [], action) {
  switch(action.type) {
    case 'RECIEVE_ALL_DATASETS':
      // this returning action dashboards may be horrific because of the mutations state thign
      return action.datasets
    default:
      return state
  }
}

function dataset(state = {}, action) {
  switch(action.type) {
    case 'RECIEVE_DATASET':
      return action.dataset
    case 'AWAITING_DATASET':
      return {}
    case 'RECIEVE_UPDATE_DATASET':
      return Object.assign({}, state, action.dataset)
    case 'UPDATE_DATASET_TYPE':
      return Object.assign({}, state, {type: 'URL'})
    case 'UNMOUNT_DATASET':
      return {}
    default:
      return state
  }
}

function sources(state = [], action) {
  switch(action.type) {
    case 'RECIEVE_ALL_SOURCES':
      // this returning action dashboards may be horrific because of the mutations state thign
      return action.sources
    default:
      return state
  }
}


const app = combineReducers({
  dashboards,
  dashboard,
  datasets,
  dataset,
  sources,
  routing: routerReducer
})

export default app
