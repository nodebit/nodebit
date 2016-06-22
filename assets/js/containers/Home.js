import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import {server} from '../server'

import DashboardList from '../components/home/DashboardList'
import DatasetList from '../components/home/DatasetList'
import SourceList from '../components/home/SourceList'

class Home extends Component {

  constructor(props) {
    super(props)
    this.getDatasets = this.getDatasets.bind(this)
    this.createDataset = this.createDataset.bind(this)
    this.deleteDataset = this.deleteDataset.bind(this)

    this.getDashboards = this.getDashboards.bind(this)
    this.createDashboard = this.createDashboard.bind(this)
    this.deleteDashboard = this.deleteDashboard.bind(this)

    this.getSources = this.getSources.bind(this)
    this.createSource = this.createSource.bind(this)
    this.deleteSource = this.deleteSource.bind(this)
  }

  componentDidMount() {
    this.getDatasets()
    this.getDashboards()
    this.getSources()
  }

  getDashboards() {
    server(this.props, 'get', '/dashboard', {},  function (dashboardArray) {
      this.props.dispatch({ type: 'RECIEVE_DASHBOARDS', dashboards: dashboardArray })
    }.bind(this))
  }

  getDatasets() {
    server(this.props, 'get', "/data", {select: ["url", "name", "id", "updatedAt", "source"]}, function (data) {
      this.props.dispatch({ type: 'RECIEVE_ALL_DATASETS', datasets: data})
    }.bind(this))
  }
  createDataset(source) {
    server(this.props, 'post', "/data", { source: source }, function (r,p) {
      if (p.statusCode == 201) {
        console.log("should redirect")
        this.props.dispatch(push("/dataset/" + r.data.id))
      }
    }.bind(this))
  }

  deleteDataset(id) {
    server(this.props, 'delete', '/data', {id: id}, function (){
      console.log("boom!")
      this.getDatasets()
    }.bind(this))
  }

  createDashboard() {
    server(this.props, 'post', "/dashboard", { tabs: [] }, function (r,p) {
      if (p.statusCode == 201) {
        console.log("should redirect")
        this.props.dispatch(push("/dashboard/" + r.data.id))
      }
    }.bind(this))
  }

  deleteDashboard(e) {
    server(this.props, 'delete', '/dashboard', {id: e.target.id}, function (){
      console.log("boom!")
      this.getDashboards()
    }.bind(this))
  }

  getSources() {
    server(this.props, 'get', "/source", {}, function (data) {
      console.log("sources", data)
      this.props.dispatch({ type: 'RECIEVE_ALL_SOURCES', sources: data})
    }.bind(this))
  }

  createSource() {
    server(this.props, 'post', "/source", {}, function (r,p) {
      if (p.statusCode == 201) {
        console.log("create response", r)
        this.props.dispatch(push("/source/" + r.data.id))
      }
    }.bind(this))
  }

  deleteSource(id) {
    server(this.props, 'delete', '/source', {id: id}, function (){
      this.getSources()
    }.bind(this))
  }

  render() {
    console.log(this.props)
    return (
      <div className="paddedContent">
        <DashboardList
          dashboards={this.props.dashboards}
          createDashboard={this.createDashboard}
          deleteDashboard={this.deleteDashboard}
        />
        <DatasetList
          datasets={this.props.datasets}
          createDataset={this.createDataset}
          deleteDataset={this.deleteDataset}
          sources={this.props.sources}
          createSource={this.createSource}
          deleteSource={this.deleteSource}
        />
      </div>
    )
  }

}

// so this is bad because now we have a render every time anything in the state changes
export default connect(state => state)(Home)
