import React, {Component} from 'react'

export default class Stat extends Component {

  render() {
    const {controls, data} = this.props
    var stat_value = data[0][controls.value]
    return (
      <div className="ui statistic">
        <div className="value">
          {stat_value}
        </div>
        <div className="label">
          {controls.label}
        </div>
      </div>
    )
  }

}
