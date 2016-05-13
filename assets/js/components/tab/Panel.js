import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'

import ParameterMapping from './ParameterMapping'

import Chart from '../charts/Chart'
import $ from 'jquery'
import _ from 'underscore'

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

    // if the array already has live working filters
    if (filter_parameters) {

      // make a copy of the filter params
      var new_filter_parameter = filter_parameters.slice(0)
      var new_fp = true
      // empty filter id does an unmap which removes the filter parameter
      if (filter_id == '') {
          new_filter_parameter = _.reject(new_filter_parameter, function(filter_parameter) {
            return filter_parameter.parameter == parameter_name
          })
          new_fp = false

      // otherwise we need to go through and update the filter
      } else {
        new_filter_parameter.forEach(function(filter_parameter) {
          if (filter_parameter.parameter == parameter_name) {
            filter_parameter.filter = filter_id
            new_fp = false
          }
        })
      }

      // if the filter parameter doesn't exist yet add it
      if (new_fp) {
        new_filter_parameter.push({parameter: parameter_name, filter: filter_id})
      }

      // perform an update
      updatePanel(id, {filter_parameters: new_filter_parameter })
    } else {
      // add the first filter parameter
      updatePanel(id, {filter_parameters: [{parameter: parameter_name, filter: filter_id}] })
    }
  }

  render() {
    const {dataset, filter_parameters, id, style, isDragging, connectDragSource, filters, dashboard_settings} = this.props
    const class_string = "ui column " + style.size + " wide"
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

    var resize_controls;
    if (!dashboard_settings.preview) {
        resize_controls = (
          <div className="ui tiny basic buttons">
            <div className={classArray[0]} onClick={this.updateSize} data-size="four">|</div>
            <div className={classArray[1]} onClick={this.updateSize} data-size="eight">|</div>
            <div className={classArray[2]} onClick={this.updateSize} data-size="twelve">|</div>
            <div className={classArray[3]} onClick={this.updateSize} data-size="sixteen">|</div>
          </div>
        )
    }
    
    var parameter_mapping;
    if (!dashboard_settings.preview) {
      parameter_mapping = (
        <ParameterMapping
          filters={filters}
          dataset={dataset}
          filter_parameters={filter_parameters}
          updateParameterFilter={this.updateParameterFilter}
        />
      )
    }

    var options = (
      <div className="options darken">
        { parameter_mapping }
        { resize_controls }
      </div>
    )

    return connectDragSource(
      <div key={id} className={class_string} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="ui cards one">
          <div className="ui card">
            <div className="ui top attached header block">
              <h4>{dataset.name}</h4>
            </div>
            { options }
            <Chart
              data={dataset.data}
              chart={dataset.chart}
              id={id}
            />
          </div>
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
