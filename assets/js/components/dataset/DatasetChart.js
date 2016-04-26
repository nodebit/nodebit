import React, {Component, PropTypes} from 'react'

import ChartControls from '../charts/ChartControls'
import Chart from '../charts/Chart'

export default class DatasetChart extends Component {

  render() {
    const {chart, data, refreshDataset, updateDataset} = this.props
    var block;
    var block2;
    block = (
      <div className="column three wide">
        <ChartControls
          refreshDataset={refreshDataset}
          updateDataset={updateDataset}
          chart={chart}
          data={data}
        />
      </div>
    )
    block2 = (
      <div className="column thirteen wide">
        <Chart chart={chart} data={data}/>
      </div>
    )
    return (
      <div className="ui grid">
        {block}
        {block2}
      </div>
    )
  }
}

DatasetChart.propTypes = {
}
