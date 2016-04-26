import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'

import Chart from '../charts/Chart'


const panelSource = {
  beginDrag(props) {
    return {}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}


class Panel extends Component {

  render() {
    const {dataset, id, isDragging, connectDragSource} = this.props
    return connectDragSource(
      <div key={id} className="column eight wide" style={{ opacity: isDragging ? 1 : 1 }}>
        <div className="content">
          <div className="header">
            {dataset.name}
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

export default DragSource('panel', panelSource, collect)(Panel)
