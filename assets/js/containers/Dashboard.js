import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import _ from 'underscore'

import {server} from '../server'

import Tab from './Tab'

class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.refreshDashboard = this.refreshDashboard.bind(this)
  }

  componentWillMount() {
    this.refreshDashboard()
  }

  componentWillUnmount() {
    console.log("blow up dashboard object")
    this.props.dispatch({type: "UNMOUNT_DASHBOARD"})
  }

  componentDidUpdate(){
    const {dashboard} = this.props
    if (!_.isEmpty(dashboard)) {
      if (dashboard.tabs.length == 0) {
        var dash_id = this.props.params.id
        server(this.props, 'post', "/tab", {dashboard: dash_id, name: 'New Tab', filters: [], panels:[]}, function (res) {
          this.props.dispatch(push("/tab/" + res.data.id))
        }.bind(this))
      } else {
        var tab_id = dashboard.tabs[0].id
        this.props.dispatch(push("/tab/" + tab_id))
      }
    }
  }

  refreshDashboard() {
    this.props.dispatch({type: "AWAITING_DASHBOARD"})
    server(this.props, 'get', '/dashboard/' + this.props.params.id, {}, function(data) {
      console.log(data)
      this.props.dispatch({type: "RECIEVE_DASHBOARD", dashboard: data})
    }.bind(this))
  }

  render() {
    return (
        <div className="ui active dimmer">
          <div className="ui loader"></div>
        </div>
      )
  }

}

// so this is bad because now we have a render every time anything in the state changes
export default connect(state => ({ auth: state.auth, dashboard: state.dashboard }))(Dashboard)
