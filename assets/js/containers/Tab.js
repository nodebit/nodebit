import React, {Component, PropTypes} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {Link} from 'react-router'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import _ from 'underscore'

import Panel from '../components/tab/Panel'
import Trash from '../components/tab/Trash'
import DatasetPicker from '../components/tab/DatasetPicker'
import SingleValueForm from '../components/common/Form'
import TabNavigation from '../components/tab/TabNavigation'
import Filters from '../components/tab/Filters'

class Tab extends Component {

  constructor(props) {
    super(props)

    this.togglePreview = this.togglePreview.bind(this)
    this.toggleFilters = this.toggleFilters.bind(this)

    this.stopStreams = this.stopStreams.bind(this)
    this.refreshTab = this.refreshTab.bind(this)

    this.createTab = this.createTab.bind(this)
    this.updateName = this.updateName.bind(this)
    this.deleteTab = this.deleteTab.bind(this)

    this.createPanel = this.createPanel.bind(this)
    this.deletePanel = this.deletePanel.bind(this)
    this.updatePanel = this.updatePanel.bind(this)

    this.createFilter = this.createFilter.bind(this)
    this.updateFilter = this.updateFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.updateFilterName = this.updateFilterName.bind(this)
    this.updateFilterValue = this.updateFilterValue.bind(this)
  }

  componentDidMount() {
    console.log("first load")
    this.refreshTab()
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEmpty(nextProps.tab) && !_.isEmpty(nextProps.dashboard) )
      return true
    else
      return false
  }

  componentDidUpdate() {
    console.log("Component did update now checking to see if url has changed")
    if (this.props.params.id !== this.props.tab.id) {
      console.log("server roundtrip to get tab")
      this.props.dispatch({type: "AWAITING_TAB"})
      this.refreshTab()
    } else {
      // jump straight to the render no further data need be loaded
    }
  }

  componentWillUnmount() {
    console.log("shutting down")
    this.props.dispatch({type: "UNMOUNT_TAB"})
    this.stopStreams()
  }
  
  stopStreams() {
    if (!_.isEmpty(this.props.tab)) {
      this.props.tab.panels.forEach(function (panel) {
        io.socket.get("/data/" + panel.dataset.room_id + "/stop")
      }.bind(this)) 
    }
  }

  togglePreview() {
    const {dashboard_settings} = this.props
    if (dashboard_settings.preview)
      this.props.dispatch({type: "STOP_PREVIEW"})
    else
      this.props.dispatch({type: "START_PREVIEW"})
  }

  toggleFilters() {
    const {dashboard_settings} = this.props
    if (dashboard_settings.filters)
      this.props.dispatch({type: "CLOSE_FILTERS"})
    else
      this.props.dispatch({type: "OPEN_FILTERS"})
  }

  deleteTab() {
    console.log("giving it a whirl on the deleting")
    io.socket.delete("/tab/" + this.props.params.id, function () {
      this.props.dispatch(push('/dashboard/' + this.props.dashboard.id))
    }.bind(this))
  }

  updateName(name) {
    const postable = {name: name}
    io.socket.put("/tab/" + this.props.params.id, postable, function (data) {
       io.socket.get("/dashboard/" + data.dashboard.id, function (dashboard) {
          this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: dashboard}) 
      }.bind(this))
    }.bind(this))
  }

  refreshTab() {
    console.log(this.props.params.id)
    this.stopStreams()
    io.socket.get('/tab/' + this.props.params.id, function(tab_data) {
      this.props.dispatch({type: "RECIEVE_TAB", tab: tab_data})
    }.bind(this))
  }

  createPanel(data_id){
    var tab_id = this.props.params.id;
    io.socket.post("/panel", {data: data_id, tab: tab_id, style: {size: "eight"}}, function (res, err) {
      console.log(res, err)
      this.refreshTab()
    }.bind(this))
  }

  createTab(data_id){
    var dash_id = this.props.dashboard.id;
    io.socket.post("/tab", {dashboard: dash_id, name: 'New Tab', filters: [], panels:[]}, function (tab) {
      io.socket.get("/dashboard/" + dash_id, function (dashboard) {
        this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: dashboard}) 
        this.props.dispatch(push("/tab/" + tab.id))
      }.bind(this))
    }.bind(this))
  }


  deletePanel(panel_id) {
    io.socket.delete("/panel/" + panel_id,function (res) {
      console.log(res)
      this.refreshTab()
    }.bind(this))
  }

  updatePanel(panel_id, postable) {
    console.log(postable, panel_id)
    io.socket.put("/panel/" + panel_id, postable, function (data, err) {
      console.log(data, err)
      this.refreshTab()
    }.bind(this))
  }


  createFilter() {
    var tab_id = this.props.params.id;
    io.socket.post("/filter", {tab: tab_id, name: '', value:'' }, function (res, err) {
      console.log(res, err)
      this.refreshTab()
    }.bind(this))
  }

  removeFilter(filter_id) {
    io.socket.delete("/filter/" + filter_id, function () {
      this.refreshTab()
    }.bind(this))
  }

  updateFilter(postable, id) {
    io.socket.put("/filter/" + id, postable, function (data) {
      this.refreshTab()
    }.bind(this))
  }

  updateFilterName(name, id) {
    const postable = {name: name}
    this.updateFilter(postable, id)
  }

  updateFilterValue(value, id) {
    const postable = {value: value}
    this.updateFilter(postable, id)
  }

  render() {
    if (!_.isEmpty(this.props.tab)) {
      const {dashboard, datasets, tab, dashboard_settings} = this.props
      const {panels, name, filters} = tab
      const used = panels.map((e) => e.dataset.id )
      const remaining_sets = datasets.filter((e) => used.indexOf(e.id) == -1 )
      var display_panels = panels.map(function (e) {
        return (
          <Panel
            id={e.id}
            key={e.id}
            style={e.style}
            dataset={e.dataset}
            filters={filters}
            filter_parameters={e.filter_parameters}
            dashboard_settings={dashboard_settings}
            updatePanel={this.updatePanel}
            deletePanel={this.deletePanel}
          />
        )
      }.bind(this))
      var editable;
      if (!dashboard_settings.preview) {
        editable = (
          <div>
            <SingleValueForm submit={this.updateName} initialValue={name}/>
            <button className="ui button" onClick={this.deleteTab}>Remove</button>
            <DatasetPicker
              datasets={remaining_sets}
              addDataset={this.createPanel}
            />
            <Trash/>
          </div>
        )
      }
      return (
        <div className={dashboard_settings.preview ? "production" : '' }>
          <TabNavigation
            dashboard={dashboard}
            tab={tab}
            createTab={this.createTab}
            togglePreview={this.togglePreview}
            dashboard_settings={dashboard_settings}
          />
          { editable }
          <Filters
            filters={filters}
            dashboard_settings={dashboard_settings}
            toggleFilters={this.toggleFilters}
            createFilter={this.createFilter}
            removeFilter={this.removeFilter}
            updateFilterName={this.updateFilterName}
            updateFilterValue={this.updateFilterValue}
          />
          <div className="ui grid">
            {display_panels}
          </div>
        </div>
      )
    } else {
      return (
        <div className="ui active dimmer">
          <div className="ui loader"></div>
        </div>
      )
    }
  }

}

export default connect(state => ({ tab: state.tab, datasets: state.datasets, dashboard: state.dashboard, dashboard_settings: state.dashboard_settings }))(DragDropContext(HTML5Backend)(Tab))
