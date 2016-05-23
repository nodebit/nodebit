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
    // don't perform any action the dashboard has tabs
  }

  componentDidUpdate(){
    const {dashboard} = this.props
    if (!_.isEmpty(dashboard)) {
      if (dashboard.tabs.length == 0) {
        var dash_id = this.props.params.id
        server(this.props, 'post', "/tab", {dashboard: dash_id, name: 'New Tab', filters: [], panels:[]}, function (res) {
          this.props.dispatch(push("/tab/" + res.data.id))
        }.bind(this))
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
    const {dashboard} = this.props
    var tab = null;
    if (typeof dashboard.tabs !== "undefined") {
      tab = (<Link to={`/tab/${dashboard.tabs[0].id}`}>{dashboard.tabs[0].name}</Link>)
    }
    return (
      tab 
    )
  }

}

// so this is bad because now we have a render every time anything in the state changes
export default connect(state => ({ auth: state.auth, dashboard: state.dashboard }))(Dashboard)
