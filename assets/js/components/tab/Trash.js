import React, {Component, PropTypes} from 'react'
import {DropTarget} from 'react-dnd'

const panelTarget = {
  drop() {
    return { location: -1 }
  }
}

class Trash extends Component {

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver

    const show = (canDrop) ? 'red' : 'white'

    return connectDropTarget(
      <div className="column sixteen wide" style={{ backgroundColor: show, textAlign: 'center', padding: 20 }}>
        <i className="trash outline icon"></i>
      </div>
    )
  }

}

export default DropTarget('panel', panelTarget, function (connect, monitor){
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
})(Trash)
