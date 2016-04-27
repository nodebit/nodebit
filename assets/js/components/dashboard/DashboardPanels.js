import React, {Component, PropTypes} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {Link} from 'react-router'

import Panel from './Panel'
import Trash from './Trash'

class DashboardPanels extends Component {

  render() {
    const {panels, deletePanel, updatePanel} = this.props
    var display_panels = panels.map(function (e) {
      return (
        <Panel
          id={e.id}
          key={e.id}
          dataset={e.dataset}
          style={e.style}
          updatePanel={updatePanel}
          deletePanel={deletePanel}
        />
      )
    })
    return (
      <div className="row">
        <Trash/>
        {display_panels}
      </div>
    )
  }

}

export default DragDropContext(HTML5Backend)(DashboardPanels)
