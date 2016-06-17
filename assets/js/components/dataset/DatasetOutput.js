import React, {Component, PropTypes} from 'react'

//dynamically load the avaliable plugins
var req = require.context("./plugins", true)

export default class DatasetOutput extends Component {

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

    this.updateOutput = this.updateOutput.bind(this)
  }

  updateOutput() {
    const outputType = this.refs.output.value;
    console.log(outputType)
    var datasetUpdates = {output: outputType}

    // I will probably want to do this with the charting too
    if (outputType == "statistic" && typeof this.props.dataset.statistic == "undefined") {
      datasetUpdates.statistic = {label: '', value: ''}
    }
    this.props.updateDataset(datasetUpdates, true)
  }

  render() {
    var component;
    var avaliable_outputs = [];
    const {refreshDataset, updateDataset, dataset} = this.props
    var {data, output} = dataset
    Object.keys(this.components).forEach(function (key) {
      // add the plugin to the list of avaliable outputs
      avaliable_outputs.push(<option value={key}>{key}</option>)

      // add selected panel
      var Control = this.components[key].default
      if (output == key) {
        component = <Control
                      controls={this.props.dataset[key]}
                      data={data}
                      refreshDataset={refreshDataset}
                      updateDataset={updateDataset}
                     />
      }
    }.bind(this))
    if (typeof output == "undefined") {
      output = ""
    }
    return (
      <div className="ui grid">
        <div className="row">
          <div className="eight wide column">
            <select ref="output" onChange={this.updateOutput} defaultValue={output}>
              <option value=""></option>
              {avaliable_outputs}
            </select>
          </div>
          <div className="eight wide column">
            Transformations
          </div>
          <div className="sixteen wide column">
            {component}
          </div>
        </div>
      </div>
    )
  }
}
