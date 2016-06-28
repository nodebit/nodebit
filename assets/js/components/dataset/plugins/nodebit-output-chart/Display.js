require('script!../../../../dependencies/plotly-latest.min.js');

import React, {Component, PropTypes} from 'react'

import _ from 'underscore'

export default class Chart extends Component {

  componentDidUpdate() {
    const {controls, data, id} = this.props
    this.buildChart(controls, data, id)
  }

  componentDidMount() {
    const {controls, data, id} = this.props
    this.buildChart(controls, data, id)
  }

  buildChart(chart, data, id) {

    //build this portion out to accomidate group
    var newChart;
    if (chart.group) {
      var newChartHash = {}
      data.forEach(function (dataRow) {
        if (!(dataRow[chart.group] in newChartHash)) {
          newChartHash[dataRow[chart.group]] = {x: [], y:[]}
        }
        newChartHash[dataRow[chart.group]].x.push(dataRow[chart.value[0].xattr])
        newChartHash[dataRow[chart.group]].y.push(dataRow[chart.value[0].yattr])
      })
      for (var key in newChartHash) {
        var value = newChartHash[key]
        value.type = chart.value[0].type
        value.name = key
      }
      newChart = _.values(newChartHash)
    } else {
      newChart = chart.value.map(function(e) {
        e.x = data.map(function (dataRow) { return dataRow[e.xattr]; });
        e.y = data.map(function (dataRow) { return dataRow[e.yattr]; });
        return e;
      })
    }

    var layout = {
      showlegend: newChart.length > 1
    }
    var settings = {
      displayModeBar: false
    }
    Plotly.newPlot("plot-" + id, newChart, layout, settings);

  }

  render() {
    const {controls, id} = this.props
    const plotId = "plot-" + id
    return (
      <div id={plotId} width="500" height="300"></div>
    )
  }

}
