import React, {Component, PropTypes} from 'react'

/*
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match

console.log(req)
var modules = requireAll(req);
console.log(modules)
// is an array containing all the matching modules
*/
//var req = require.context("../plugins", true, /^\.\/.*\.js$/)
var req = require.context("./plugins", true)
console.log(req.keys())

export default class DatasetOutput extends Component {


  constructor(props) {
    super(props)
    this.components = {}

    var files = req.keys()
    files.forEach(function (file) {
      if (file.indexOf("/Controls.js") !== -1) {
        var componentId = req.resolve(file)
        console.log(file)
        var component = __webpack_require__(componentId)
        console.log(component)
        var matches = file.match(/nodebit-output-([^\/\\]+)\/Controls.js$/)
        var componentType = matches[1]
        this.components[componentType] = component
      }
    }.bind(this))

    console.log(this.components)
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
      <div>
        <select ref="output" onChange={this.updateOutput} defaultValue={output}>
          <option value=""></option>
          {avaliable_outputs}
        </select>
        {component}
      </div>
    )
  }
}
