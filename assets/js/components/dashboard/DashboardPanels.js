import React, {Component, PropTypes} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {Link} from 'react-router'

import Panel from './Panel'

class DashboardPanels extends Component {

  render() {
    const {panels} = this.props
    var display_panels = panels.map(function (e, i) {
      return (
        <Panel
          dataset={e.dataset}
          id={i}
          key={i}
        />
      )
    })
    return (
      <div className="row">
        {display_panels}
      </div>
    )
  }

}

export default DragDropContext(HTML5Backend)(DashboardPanels)
