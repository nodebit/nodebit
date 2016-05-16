require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

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
    io.socket.get("/dashboard", {}, function (dashboardArray) {
      this.props.dispatch({ type: 'RECIEVE_DASHBOARDS', dashboards: dashboardArray })
    }.bind(this))
  }

  getDatasets() {
    io.socket.get("/data", {select: ["url", "name", "id", "updatedAt"]}, function (data) {
      this.props.dispatch({ type: 'RECIEVE_ALL_DATASETS', datasets: data})
    }.bind(this))
  }
  createDataset() {
    io.socket.post("/data", { type: "DB", chart: { value: [] } }, function (r,p) {
      if (p.statusCode == 201) {
        console.log("should redirect")
        this.props.dispatch(push("/dataset/" + r.id))
      }
    }.bind(this))
  }

  deleteDataset(id) {
    io.socket.delete('/data', {id: id}, function (){
      console.log("boom!")
      this.getDatasets()
    }.bind(this))
  }

  createDashboard() {
    io.socket.post("/dashboard", { tabs: [] }, function (r,p) {
      if (p.statusCode == 201) {
        console.log("should redirect")
        this.props.dispatch(push("/dashboard/" + r.id))
      }
    }.bind(this))
  }

  deleteDashboard(e) {
    console.log(e.target)
    io.socket.delete('/dashboard', {id: e.target.id}, function (){
      console.log("boom!")
      this.getDashboards()
    }.bind(this))
  }

  getSources() {
    io.socket.get("/source", {}, function (data) {
      this.props.dispatch({ type: 'RECIEVE_ALL_SOURCES', sources: data})
    }.bind(this))
  }

  createSource() {
    io.socket.post("/source", {}, function (r,p) {
      if (p.statusCode == 201) {
        io.socket.get("/source", {}, function (data) {
          this.props.dispatch({ type: 'RECIEVE_ALL_SOURCES', sources: data})
          this.props.dispatch(push("/source/" + r.id))
        }.bind(this))
      }
    }.bind(this))
  }

  deleteSource(id) {
    io.socket.delete('/source', {id: id}, function (){
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
        />
        <SourceList
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
