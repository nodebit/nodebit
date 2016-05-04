import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'

import ParameterMapping from './ParameterMapping'

import Chart from '../charts/Chart'
import $ from 'jquery'

const panelSource = {
  beginDrag(props) {
    return {
      id: props.id,
      deletePanel: props.deletePanel
   }
 },
  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()

    if (dropResult) {
      console.log(dropResult.location, item.id)
      if (dropResult.location == -1) {
        item.deletePanel(item.id)
      }
    }
  }
}

class Panel extends Component {

  constructor(props) {
    super(props)

    this.updateSize = this.updateSize.bind(this)
    this.updateParameterFilter = this.updateParameterFilter.bind(this)
  }

  updateSize(e) {
    const {updatePanel, id, style} = this.props
    updatePanel(id, {style: {size: e.target.getAttribute('data-size')}})
  }

  updateParameterFilter(parameter_name, filter_id) {
    const {id, filter_parameters, updatePanel} = this.props
    console.log("i work hard for my money")
    if (filter_parameters) {
      var new_filter_parameter = filter_parameters.slice(0)
      var new_fp = true
      new_filter_parameter.forEach(function(filter_parameter) {
        if (filter_parameter.parameter == parameter_name) {
          filter_parameter.filter = filter_id
          new_fp = false
        }
      })
      if (new_fp) {
        new_filter_parameter.push({parameter: parameter_name, filter: filter_id})
      }
      updatePanel(id, {filter_parameters: new_filter_parameter })
    } else {
      updatePanel(id, {filter_parameters: [{parameter: parameter_name, filter: filter_id}] })
    }
  }

  render() {
    const {dataset, filter_parameters, id, style, isDragging, connectDragSource, filters} = this.props
    const class_string = "column " + style.size + " wide"
    const default_class ="ui button"
    const classArray = [default_class, default_class, default_class, default_class]

    if (style.size == "four") {
      classArray[0] = default_class + " active"
    }
    if (style.size == "eight") {
      classArray[0] = default_class + " active"
      classArray[1] = default_class + " active"
    }
    if (style.size == "twelve") {
      classArray[0] = default_class + " active"
      classArray[1] = default_class + " active"
      classArray[2] = default_class + " active"
    }
    if (style.size == "sixteen") {
      classArray[0] = default_class + " active"
      classArray[1] = default_class + " active"
      classArray[2] = default_class + " active"
      classArray[3] = default_class + " active"
    }

    return connectDragSource(
      <div key={id} className={class_string} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="panel">
          <div className="ui tiny basic buttons sizing right">
            <div className={classArray[0]} onClick={this.updateSize} data-size="four">|</div>
            <div className={classArray[1]} onClick={this.updateSize} data-size="eight">|</div>
            <div className={classArray[2]} onClick={this.updateSize} data-size="twelve">|</div>
            <div className={classArray[3]} onClick={this.updateSize} data-size="sixteen">|</div>
          </div>
          <div className="header">
            <h4>{dataset.name}</h4>
          </div>
          <ParameterMapping
            filters={filters}
            dataset={dataset}
            filter_parameters={filter_parameters}
            updateParameterFilter={this.updateParameterFilter}
          />
          <Chart
            data={dataset.data}
            chart={dataset.chart}
            id={id}
          />
        </div>
      </div>
    )
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource('panel', panelSource, collect)(Panel)
