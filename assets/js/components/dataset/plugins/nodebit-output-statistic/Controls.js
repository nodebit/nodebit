
import React, {Component, PropTypes} from 'react'

import Display from './Display.js'

export default class Controls extends Component {

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
    const {controls, data, refreshDataset, updateDataset} = this.props
    const values = Object.keys(data[0]).map( (e)=>(
      <option value={e}>{e}</option>
    ))
    return (
      <div className="">
        <div className="">
          <label>Label</label>
          <input type="text" defaultValue={controls.label} ref="labeler" onChange={this.updateStatistic}/>
          <label>Value</label>
          <select defaultValue={controls.value} ref="value" onChange={this.updateStatistic}>
            {values}
          </select>
        </div>
        <Display
          controls={controls}
          data={data}
        />
      </div>
    )
  }
}
