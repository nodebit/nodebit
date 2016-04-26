require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import SingleValueForm from '../components/common/Form'
import DashboardPanels from '../components/dashboard/DashboardPanels'
import DatasetPicker from '../components/dashboard/DatasetPicker'

import _ from 'underscore'

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.refreshDashboard = this.refreshDashboard.bind(this)
    this.createPanel = this.createPanel.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateDashboard = this.updateDashboard.bind(this)
  }

  componentWillMount() {
    this.refreshDashboard()
  }

  componentWillUnmount() {
    console.log("shutting down");
    this.props.dispatch({type: "UNMOUNT_DASHBOARD"})
  }

  refreshDashboard() {
    io.socket.get('/dashboard/' + this.props.params.id, function(data) {
      console.log(data)
      this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: data})
    }.bind(this))
  }

  updateDashboard(postable) {
    io.socket.put("/dashboard/" + this.props.params.id, postable, function (data) {
      this.props.dispatch({type: "RECIEVE_UPDATE_DASHBOARD", dashboard: data})
    }.bind(this))
  }

  updateName(name) {
    this.updateDashboard({name: name})
  }

  createPanel(data_id){
    var dash_id = this.props.params.id;
    io.socket.post("/panel", {data: data_id, dashboard: dash_id}, function (res) {
      this.refreshDashboard()
    }.bind(this))
  }

  render() {
    const {dashboard, datasets} = this.props
    var block
    if (!_.isEmpty(dashboard)) {
      // Pull only the datasets that haven't been used
      const used = dashboard.panels.map((e) => e.dataset.id )
      const remaining_sets = datasets.filter((e) => used.indexOf(e.id) == -1 )
      block = (
        <div className="ui grid">
          <div className="row">
            <div className="column wide sixteen">
              <h1>{dashboard.name}</h1>
              <SingleValueForm submit={this.updateName}/>
              <DatasetPicker
                datasets={remaining_sets}
                addDataset={this.createPanel}
              />
            </div>
          </div>
          <DashboardPanels
            {...dashboard}
          />
        </div>
      )
    } else {
      block = (
        <div className="ui active dimmer">
          <div className="ui loader"></div>
        </div>
      )
    }
    return block
  }

}

// so this is bad because now we have a render every time anything in the state changes
export default connect(state => ({ dashboard: state.dashboard, datasets: state.datasets}))(Dashboard)
