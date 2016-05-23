import React, {Component, PropTypes} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {Link} from 'react-router'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import _ from 'underscore'
import {server} from '../server'

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
    this.refreshTab()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEmpty(nextProps.tab) && !_.isEmpty(nextProps.dashboard) )
      return true
    else
      return false
  }

  componentDidUpdate() {
    if (this.props.params.id !== this.props.tab.id) {
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
        server(this.props, 'get', "/data/" + panel.dataset.room_id + "/stop", {}, function () {

        })
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
    server(this.props, 'delete', "/tab/" + this.props.params.id, {}, function () {
      this.props.dispatch(push('/dashboard/' + this.props.dashboard.id))
    }.bind(this))
  }

  updateName(name) {
    this.updateTab({name: name}, true)
  }

  refreshTab() {
    console.log(this.props.params.id)
    this.stopStreams()
    server(this.props, 'get', '/tab/' + this.props.params.id, {}, function(tab_data) {
        this.props.dispatch({type: "RECIEVE_TAB", tab: tab_data})
    }.bind(this))
  }

  createPanel(data_id){
    var tab_id = this.props.params.id;
    server(this.props, 'post', "/panel", {data: data_id, tab: tab_id, style: {size: "eight"}}, function (res, err) {
      console.log(res, err)
      this.refreshTab()
    }.bind(this))
  }

  createTab(data_id){
    var dash_id = this.props.dashboard.id;
    server(this.props, 'post', "/tab", {dashboard: dash_id, name: 'New Tab', filters: [], panels:[]}, function (res) {
      server(this.props, 'get', "/dashboard/" + dash_id, {}, function (dashboard) {
        console.log(dashboard)
        this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: dashboard})
        this.props.dispatch(push("/tab/" + res.data.id))
      }.bind(this))
    }.bind(this))
  }

  deletePanel(panel_id) {
    server(this.props, 'delete', "/panel/" + panel_id, {}, function (res) {
      console.log(res)
      this.refreshTab()
    }.bind(this))
  }

  updatePanel(panel_id, postable) {
    console.log(postable, panel_id)
    server(this.props, 'put', "/panel/" + panel_id, postable, function (data, err) {
      console.log(data, err)
      this.refreshTab()
    }.bind(this))
  }


  createFilter() {
    var tab_id = this.props.params.id;
    server(this.props, 'post', "/filter", {tab: tab_id, name: '', value:'' }, function (res, err) {
      console.log(res, err)
      this.refreshTab()
    }.bind(this))
  }

  removeFilter(filter_id) {
    server(this.props, 'delete', "/filter/" + filter_id, {}, function () {
      this.refreshTab()
    }.bind(this))
  }

  updateFilter(postable, id) {
    server(this.props, 'put', "/filter/" + id, postable, function (data) {
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

export default connect(state => ({ auth: state.auth, tab: state.tab, datasets: state.datasets, dashboard: state.dashboard, dashboard_settings: state.dashboard_settings }))(DragDropContext(HTML5Backend)(Tab))
