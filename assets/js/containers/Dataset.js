require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import _ from 'underscore'

import DatasetInformation from '../components/dataset/DatasetInformation'
import DatasetData from '../components/dataset/DatasetData'
import DatasetChart from '../components/dataset/DatasetChart'

class Dataset extends Component {

  constructor(props) {
    super(props)
    this.updateSQL = this.updateSQL.bind(this)
    this.updateDataset = this.updateDataset.bind(this)
    this.refreshDataset = this.refreshDataset.bind(this)
  }

  componentWillMount() {
    this.refreshDataset()
  }

  componentWillUnmount() {
    console.log("shutting down");
    this.props.dispatch({type: "UNMOUNT_DATASET"})
  }

  refreshDataset() {
    this.props.dispatch({type: "AWAITING_DATASET"})
    io.socket.get('/data/' + this.props.params.id, function(data) {
      this.props.dispatch({type: "RECIEVE_DATASET", dataset: data});
    }.bind(this))
  }

  updateDataset(postable, full_reset=false) {
    io.socket.put("/data/" + this.props.params.id, postable, function (data) {
      if (full_reset)
        this.refreshDataset()
      else
        this.props.dispatch({type: "RECIEVE_UPDATE_DATASET", dataset: data})
    }.bind(this))
  }

  updateSQL(sql) {
    const postable = {sql: sql};
    io.socket.put("/data/" + this.props.params.id + "/sql", postable, function (data) {
      this.props.dispatch({type: "RECIEVE_DATASET", dataset: data})
    }.bind(this))
  }

  render() {
    const {dataset, sources} = this.props
    console.log(dataset)
    var block
    if (!_.isEmpty(dataset)) {
      var charts;
      if (typeof dataset.data !== "undefined" && dataset.data.length > 0) {
        charts = (
          <DatasetChart
            {...dataset}
            refreshDataset={this.refreshDataset}
            updateDataset={this.updateDataset}
          />
        )
      }
      var error;
      if (dataset.errors) {
        error = (
          <div className="row">
            <div className="column sixteen wide">
              <div className="ui negative message">
                <div className="header">
                  Data Error
                </div>
                <p>{dataset.errors[0].message}</p>
              </div>
            </div>
          </div>
        )
      }
      block = (
        <div className="ui grid">
              {error}
          <div className="row">
            <div className="three wide column">
              <DatasetInformation
                {...dataset}
                sources={sources}
                updateDataset={this.updateDataset}
              />
            </div>
            <div className="six wide column">
              <DatasetData
                {...dataset}
                updateSQL={this.updateSQL}
              />
            </div>
            <div className="seven wide column">
              {charts}
            </div>
          </div>
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
export default connect(state => ({ dataset: state.dataset, sources: state.sources }))(Dataset)
