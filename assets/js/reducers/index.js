import {combineReducers} from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

function tab(state = {}, action) {
  switch(action.type) {
    case 'REPLACE_TAB_DATASET_DATA':
      if (typeof state.panels !== "undefined") {
        state.panels.forEach(function (panel) {
          if (panel.dataset.room_id == action.room_id) {
            panel.dataset.errors = []
            panel.dataset = Object.assign({}, panel.dataset, {data:action.data})
          } 
        })
        
        var new_panels = state.panels.slice(0)
        return Object.assign({},state, {panels: new_panels})
      } else {
        console.log("PUSHING DATA INTO UNSET PANEL")
        return state
      }
    case 'STREAM_TAB_DATASET_DATA':
      if (typeof state.panels !== "undefined") {
        state.panels.forEach(function (panel) {
          if (panel.dataset.room_id == action.room_id) {
            if (typeof state.buffer === "undefined")
              state.buffer = 5
              
            panel.dataset.errors = []
            panel.dataset.data.unshift(action.data)
            panel.dataset.data = panel.dataset.data.slice(0, state.buffer)
          } 
        })
        var new_panels = state.panels.slice(0)
        return Object.assign({},state, {panels: new_panels})
      } else {
        console.log("PUSHING DATA INTO UNSET PANEL")
        return state
      }
    case 'ERROR_TAB_DATASET_DATA':
      if (typeof state.panels !== "undefined") {
        state.panels.forEach(function (panel) {
          if (panel.dataset.room_id == action.room_id) {
            panel.dataset = Object.assign({}, panel.dataset, {errors:[action.data], data: []})
          } 
        })
        
        var new_panels = state.panels.slice(0)
        return Object.assign({},state, {panels: new_panels})
      } else {
        console.log("PUSHING DATA INTO UNSET PANEL")
        return state
      }
    case 'RECIEVE_TAB':
      return action.tab
    case 'AWAITING_TAB':
      return {}
    case 'RECIEVE_UPDATE_TAB':
      return Object.assign({}, state, action.tab)
    case 'UNMOUNT_TAB':
      return {}
    default:
      return state
  }
}

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

function dashboard_settings(state={preview: false, filters: false}, action) {
  switch(action.type) {
      case 'START_PREVIEW':
        return Object.assign({}, state, {preview: true })
      case 'STOP_PREVIEW':
        return Object.assign({}, state, {preview: false })
      case 'OPEN_FILTERS':
        return Object.assign({}, state, {filters: true })
      case 'CLOSE_FILTERS':
        return Object.assign({}, state, {filters: false })
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
    case 'REPLACE_DATASET_DATA':
      return Object.assign({}, state, {data: action.data, errors: []})
    case 'STREAM_DATASET_DATA':
      state.data.unshift(action.data)
      if (typeof state.buffer === "undefined")
        state.buffer = 5
      var newData = state.data.slice(0,state.buffer)
      return Object.assign({}, state, {data: newData, errors: []})
    case 'ERROR_DATASET_DATA':
      return Object.assign({}, state, {errors: action.data })
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

function source(state = {}, action) {
  switch(action.type) {
    case 'RECIEVE_SOURCE':
      return action.source
    default:
      return state
  }
}

function auth(state={isAuthenticated: false, token: null}, action) {
  switch(action.type) {
    case 'LOGIN':
      return {isAuthenticated: true, token: action.token}
    case 'LOGOUT':
      return {isAuthenticated: false, token: null}
    default:
      return state
  }
}


const app = combineReducers({
  tab,
  dashboards,
  dashboard,
  dashboard_settings,
  datasets,
  dataset,
  sources,
  source,
  auth,
  routing: routerReducer
})

export default app
