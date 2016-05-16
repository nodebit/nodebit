import React, {Component, PropTypes} from 'react'

import DatasetStatistic from './DatasetStatistic'
import DatasetChart from './DatasetChart'

export default class DatasetOutput extends Component {


  constructor(props) {
    super(props)

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
    const {refreshDataset, updateDataset, dataset} = this.props
    var {data, output} = dataset
    if (typeof output == "undefined") {
      output = ""
    }
    switch (output) {
      case "chart":
        component = <DatasetChart 
                      chart={this.props.dataset.chart} 
                      data={data} 
                      refreshDataset={refreshDataset} 
                      updateDataset={updateDataset}
                     />
        break;
      case "statistic":
        if (typeof this.props.dataset.statistic !== "undefined") {
          component = <DatasetStatistic
                        statistic={this.props.dataset.statistic} 
                        data={data} 
                        refreshDataset={refreshDataset} 
                        updateDataset={updateDataset}
                       />
        }

        break;
    }
    return (
      <div>
        <select ref="output" onChange={this.updateOutput} defaultValue={output}>
          <option value=""></option>
          <option value="chart">Chart</option>
          <option value="statistic">Statistic</option>
          <option value="table">Table</option>
        </select>
        {component}
      </div>
    )
  }
}
