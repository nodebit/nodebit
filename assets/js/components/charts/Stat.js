import React, {Component, PropTypes} from 'react'

import _ from 'underscore'

export default class Stat extends Component {

  render() {
    const {statistic, data} = this.props
    var stat_value = data[0][statistic.value]
    return (
      <div className="ui statistic">
        <div className="value">
          {stat_value}
        </div>
        <div className="label">
          {statistic.label}
        </div>
      </div>
    )
  }

}
