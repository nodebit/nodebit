import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import _ from 'underscore'

import {server} from '../server'

import DatasetInformation from '../components/dataset/DatasetInformation'
import DatasetData from '../components/dataset/DatasetData'
import DatasetOutput from '../components/dataset/DatasetOutput'

class Dataset extends Component {

  constructor(props) {
    super(props)
    this.updateSQL = this.updateSQL.bind(this)
    this.updateDataset = this.updateDataset.bind(this)
    this.createParameter = this.createParameter.bind(this)
    this.updateParameter = this.updateParameter.bind(this)
    this.removeParameter = this.removeParameter.bind(this)

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
    server(this.props, 'get', '/data/' + this.props.params.id, {}, function(data) {
      this.props.dispatch({type: "RECIEVE_DATASET", dataset: data});
    }.bind(this))
  }

  updateDataset(postable, full_reset=false) {
    server(this.props, 'put', "/data/" + this.props.params.id, postable, function (data) {
      if (full_reset)
        this.refreshDataset()
      else
        this.props.dispatch({type: "RECIEVE_UPDATE_DATASET", dataset: data})
    }.bind(this))
  }

  updateSQL(sql) {
    const postable = {sql: sql};
    server(this.props, 'put', "/data/" + this.props.params.id + "/sql", postable, function (data) {
      this.props.dispatch({type: "RECIEVE_DATASET", dataset: data})
    }.bind(this))
  }

  createParameter() {
    const postable = {name: '', type: '', value: '' }
    server(this.props, 'post', "/data/" + this.props.params.id + "/parameters", postable, function (data){
      this.refreshDataset()
    }.bind(this))
  }

  updateParameter(index, name, type, value) {
    const parameter = { name: name, type: type, value: value }
    var new_parameters = this.props.dataset.parameters.slice(0)
    new_parameters[index] = parameter
    const postable = { parameters: new_parameters }
    this.updateDataset(postable, true)
    this.props.dispatch({type: "AWAITING_DATASET"})
  }

  removeParameter(index) {
    var new_parameters = this.props.dataset.parameters.slice(0)
    new_parameters.splice(index, 1)
    const postable = { parameters: new_parameters }
    this.updateDataset(postable, true)
    this.props.dispatch({type: "AWAITING_DATASET"})
  }


  render() {
    const {dataset, sources} = this.props
    var block
    if (!_.isEmpty(dataset)) {
      var output;
      if (typeof dataset.data !== "undefined" && dataset.data.length > 0) {
        output = (
          <div>
            <DatasetOutput
              dataset={dataset}
              refreshDataset={this.refreshDataset}
              updateDataset={this.updateDataset}
            />
          </div>
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
                createParameter={this.createParameter}
                updateParameter={this.updateParameter}
                removeParameter={this.removeParameter}
              />
            </div>
            <div className="six wide column">
              <DatasetData
                {...dataset}
                updateSQL={this.updateSQL}
              />
            </div>
            <div className="seven wide column">
              {output}
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
export default connect(state => ({ auth:state.auth, dataset: state.dataset, sources: state.sources }))(Dataset)
