import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'

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
  }

  updateSize(e) {
    const {updatePanel, id, style} = this.props
    updatePanel(id, {style: {size: e.target.getAttribute('data-size')}})
  }

  render() {
    const {dataset, id, style, isDragging, connectDragSource} = this.props
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
        <div className="ui attached header top">
          {dataset.name}
          <div className="ui tiny basic buttons sizing right">
            <div className={classArray[0]} onClick={this.updateSize} data-size="four">|</div>
            <div className={classArray[1]} onClick={this.updateSize} data-size="eight">|</div>
            <div className={classArray[2]} onClick={this.updateSize} data-size="twelve">|</div>
            <div className={classArray[3]} onClick={this.updateSize} data-size="sixteen">|</div>
          </div>
        </div>
        <div className="ui attached segment bottom">
          <div className="header">
          </div>
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
