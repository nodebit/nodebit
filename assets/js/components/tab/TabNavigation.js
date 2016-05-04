import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

export default class TabNavigation extends Component {

  render() {
    const {dashboard, createTab} = this.props
    const currentId = this.props.tab.id
    const items = dashboard.tabs.map((tab) => (
      <Link to={`/tab/${tab.id}`} className={ (currentId == tab.id) ? 'item active' : 'item' }>{tab.name}</Link>
    ))
    return (
      <div className="ui menu">
        {items}
        <div className="right menu">
          <a className="item" onClick={createTab}>Create Tab</a>
        </div>
      </div>
    )
  }
}
