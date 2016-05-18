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

    this.switchTab = this.switchTab.bind(this)
    this.refreshTab = this.refreshTab.bind(this)

    this.createTab = this.createTab.bind(this)
    this.updateTab = this.updateTab.bind(this)
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
    console.log("trying to decide if we reload")
    console.log(nextProps, this.props)
    if (!_.isEmpty(nextProps.tab) && !_.isEmpty(nextProps.dashboard) )
      return true
    else
      return false
  }

  componentDidUpdate() {
    console.log("about to render with an optional server reload")
    console.log(this.props)
    if (this.props.params.id !== this.props.tab.id) {
      console.log("performing the optional server reload")
      this.props.dispatch({type: "AWAITING_TAB"})
      this.props.dispatch({type: "AWAITING_DASHBOARD"})
      this.refreshTab()
    } else {
      // jump straight to the render no further data need be loaded
    }
  }

  componentWillUnmount() {
    console.log("shutting down")
    this.props.dispatch({type: "UNMOUNT_TAB"})
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

  updateTab(postable, full_reset=false) {
    server(this.props, 'put', "/tab/" + this.props.params.id, postable, function (data) {
      if (full_reset)
        this.refreshTab()
      else
        this.props.dispatch({type: "RECIEVE_UPDATE_TAB", tab: data})
    }.bind(this))
  }

  switchTab(tab_id) {
    console.log("what a pleasant day for a switchTab")
    this.props.dispatch(push("/tab/" + tab_id))
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
    server(this.props, 'get', '/tab/' + this.props.params.id, {}, function(tab_data) {
      var dashboard_id = tab_data.dashboard.id
      server(this.props, 'get', '/dashboard/' + dashboard_id, {}, function(dash_data) {
        console.log("pushing to reducer", dash_data, tab_data)
        this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: dash_data})
        this.props.dispatch({type: "RECIEVE_TAB", tab: tab_data})
      }.bind(this))
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
      this.props.dispatch(push("/tab/" + res.data.id))
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
            switchTab={this.switchTab}
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
