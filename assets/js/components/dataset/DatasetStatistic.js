
import React, {Component, PropTypes} from 'react'

import DatasetStatistic from '../charts/Stat.js'

export default class DatasetChart extends Component {

  constructor(props) {
    super(props) 

    this.updateStatistic = this.updateStatistic.bind(this)
  }

  updateStatistic() {
    var statistic = {}
    statistic.label = this.refs.labeler.value
    statistic.value = this.refs.value.value
    this.props.updateDataset({statistic: statistic})
  }

  render() {
    const {statistic, data, refreshDataset, updateDataset} = this.props
    const values = Object.keys(data[0]).map( (e)=>(
      <option value={e}>{e}</option>      
    ))
    return (
      <div className="">
        <div className="">
          <label>Label</label>
          <input type="text" defaultValue={statistic.label} ref="labeler" onChange={this.updateStatistic}/>
          <label>Value</label>
          <select defaultValue={statistic.value} ref="value" onChange={this.updateStatistic}>
            {values}
          </select>
        </div>
        <DatasetStatistic
          statistic={statistic}
          data={data}
        />
      </div>
    )
  }
}
