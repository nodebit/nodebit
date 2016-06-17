import React, {Component, PropTypes} from 'react'

import ChartControls from './components/ChartControls'
import Display from './Display'

export default class DatasetChart extends Component {

  render() {
    const {controls, data, refreshDataset, updateDataset} = this.props
    var block;
    var block2;
    block = (
      <div className="row">
        <ChartControls
          refreshDataset={refreshDataset}
          updateDataset={updateDataset}
          controls={controls}
          data={data}
        />
      </div>
    )
    block2 = (
      <div className="row">
        <Display
          controls={controls}
          data={data}
        />
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
