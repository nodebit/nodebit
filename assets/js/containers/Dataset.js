import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import _ from 'underscore'

import {server} from '../server'

import DatasetInformation from '../components/dataset/DatasetInformation'
import DatasetData from '../components/dataset/DatasetData'
import DatasetOutput from '../components/dataset/DatasetOutput'

import JsonTable from 'react-json-table'

var req = require.context("../components/dataset/plugins", true)

class Dataset extends Component {

  constructor(props) {
    super(props)
    
    this.components = {}

    var files = req.keys()
    files.forEach(function (file) {
      if (file.indexOf("/Controls.js") !== -1) {
        var componentId = req.resolve(file)
        var component = __webpack_require__(componentId)
        var matches = file.match(/nodebit-output-([^\/\\]+)\/Controls.js$/)
        var componentType = matches[1]
        this.components[componentType] = component
      }
    }.bind(this))
    
    this.updateSQL = this.updateSQL.bind(this)
    this.updateDataset = this.updateDataset.bind(this)
    this.createParameter = this.createParameter.bind(this)
    this.updateParameter = this.updateParameter.bind(this)
    this.removeParameter = this.removeParameter.bind(this)

    this.refreshDataset = this.refreshDataset.bind(this)
    this.updateOutput = this.updateOutput.bind(this)
  }

  componentWillMount() {
    this.refreshDataset()
  }

  componentWillUnmount() {
    server(this.props, 'get', "/data/" + this.props.dataset.room_id + "/stop", {}, function () {
      this.props.dispatch({type: "UNMOUNT_DATASET"})
    }.bind(this))
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
  
  updateOutput() {
    const outputType = this.refs.output.value;
    console.log(outputType)
    var datasetUpdates = {output: outputType}

    // initialization values
    if (outputType == "statistic" && typeof this.props.dataset.statistic == "undefined") {
      datasetUpdates.statistic = { label: '', value: '' }
    } else if (outputType == "chart" && typeof this.props.dataset.chart == "undefined") {
      datasetUpdates.chart =  { value: [] }        
    }
    this.updateDataset(datasetUpdates, true)
  }


  render() {
    const {dataset} = this.props
    var block
    if (!_.isEmpty(dataset)) {
      var output
      var data_grid
      var step_type
  
      if (typeof dataset.data !== "undefined" && dataset.data.length > 0) {
        output = (
            <DatasetOutput
              dataset={dataset}
              refreshDataset={this.refreshDataset}
              updateDataset={this.updateDataset}
            />
        )
        /*
        if (typeof output == "undefined") {
          output = ""
        }
        */
        var avaliable_outputs = [(<option value=""></option>)]
        Object.keys(this.components).forEach(function (key) {
          avaliable_outputs.push(<option value={key}>{key}</option>)
        })
        step_type = (
          <div className="ui grid">
            <div className="row">
              <div className="eight wide column">
                Output
                <select onChange={this.updateOutput} defaultValue={dataset.output} ref="output">
                  {avaliable_outputs}
                </select>
              </div>
              <div className="eight wide column">
                Transformation
              </div>
            </div>
          </div>
        )
        data_grid = (
          <div className="ui grid">
            <div className="row">
              <div className="sixteen column wide scroll">
                <JsonTable rows={dataset.data} columns={Object.keys(dataset.data[0])} className="dataTable"/>
              </div>
            </div>
          </div>
        )
      }
      var error;
      if (typeof dataset.errors !== "undefined" && dataset.errors.length > 0) {
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
        <div className="editorFlow">
          <div className="ui grid">
            {error}
            <div className="row">
                <DatasetInformation
                  {...dataset}
                  updateDataset={this.updateDataset}
                />
            </div>
          </div>
          <DatasetData
            {...dataset}
            updateSQL={this.updateSQL}
            createParameter={this.createParameter}
            updateParameter={this.updateParameter}
            removeParameter={this.removeParameter}
          />
          {data_grid}
          {step_type}
          {output}
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
