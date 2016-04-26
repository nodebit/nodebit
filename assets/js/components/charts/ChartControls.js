import React, {Component, PropTypes} from 'react'

import _ from 'underscore'
import $ from 'jquery'

export default class ChartControls extends Component {

  constructor(props) {
    super(props)
    this.updateChart = this.updateChart.bind(this)
  }

  updateChart() {
    var chartType = $(".chartType").val();
    var chartInfo = {type: chartType};
    if (chartType == "scatter")
      chartInfo.mode = "markers";
    if (chartType == "line")
      chartInfo.type = "scatter";

    var yAxis = [];
    var xAxis;
    var group;
    $(".ul .li").each( function (i, e) {
      if ($(e).find(".x:checked").length > 0) xAxis = e.id;
      if ($(e).find(".y:checked").length > 0) yAxis.push(e.id);
      if ($(e).find(".g:checked").length > 0) group = e.id;
    });

    // If we have at least an x and y axis set then we can push
    if (xAxis != '' && yAxis != []) {
      const newChart = yAxis.map(function (y) {
        // Name is added here so that charts with multiple ys show proper trace name
        return _.extend({ xattr: xAxis, yattr: y, name: y}, chartInfo)
      })

      var postableChart = _.extend({}, this.props.chart)
      postableChart.value = newChart
      postableChart.group = group

      postableChart.value.forEach( function (e) {
        delete e.x;
        delete e.y;
      })

      this.props.updateDataset({chart: postableChart})
    }
  }

  render() {
    console.log(this.props)
    const {chart, data} = this.props
    var yCheck = []
    var gCheck;
    var xCheck;
    var chartType = "";

    // Values is an array where each element represents and XY data group
    if (chart.value.length > 0) {
      yCheck = chart.value.map(function (e) {return e.yattr});

      // We have a top level chart variable that indicates grouping
      gCheck = chart.group

      // For now we are holding that the first data group contains the X Axis
      // and the chart type for the entire plot
      xCheck = chart.value[0].xattr;
      // If we have more than one trace then we need to see what we grouped by
      chartType = chart.value[0].type;

      // Chart type is line if scatter plot and the mode isn't requested as markers
      if (chartType == "scatter" && chart.value[0].mode != "markers")
        chartType = "line"
    }

    // Create dropdown item for each chart type
    var chartTypes = [ "scatter", "histogram", "bar", "line"];
    var chartOptions = chartTypes.map(function(str) {
      return (<option value={str}>{str}</option>);
    })

    // Create the radio field grid for each element in the dataset
    var items = Object.keys(data[0]).map( function(e) {
      var x = (<input onChange={this.updateChart} type="checkbox" className="x"/>)
      if (e == xCheck)
        x = (<input onChange={this.updateChart} type="checkbox" className="x" defaultChecked/>)

      var y = (<input onChange={this.updateChart} type="checkbox" className="y"/>)
      if (_.contains(yCheck, e))
        y = (<input onChange={this.updateChart} type="checkbox" className="y" defaultChecked/>)

      var g = (<input onChange={this.updateChart} type="checkbox" className="g"/>)
      if (e == gCheck)
        g = (<input onChange={this.updateChart} type="checkbox" className="g" defaultChecked/>)

      return (
        <div className="li item" id={e}>
          <strong>{e}</strong>
          <div className="ui">
            <label>X</label>
            {x}
          </div>
          <div className="ui">
            <label>Y</label>
            {y}
          </div>
          <div className="ui">
            <label>G</label>
            {g}
          </div>
        </div>
      )
    }.bind(this))
    return (
      <div>
        <select onChange={this.updateChart} defaultValue={chartType} className="ui dropdown chartType">
          {chartOptions}
        </select>
        <div className="ui ul list">
          {items}
        </div>
      </div>
    )
  }
}
