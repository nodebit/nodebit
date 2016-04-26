import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import Chart from '../charts/Chart'

export default class DashboardPanels extends Component {

  render() {
    const {panels} = this.props
    var display_panels = panels.map(function (e, i) {
      return (
        <div key={e.dataset.id} className="column eight wide">
          <div className="content">
            <div className="header">
              {e.dataset.name}
            </div>
            <Chart
              data={e.dataset.data}
              chart={e.dataset.chart}
              id={i}
            />
          </div>
        </div>
      )
    })
    return (
      <div className="row">
        {display_panels}
      </div>
    )
  }

}
