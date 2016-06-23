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
    return (
      <div className="ui grid">
        <div className="row">
          <div className="sixteen wide column">
            {component}
          </div>
        </div>
      </div>
    )
  }
}
