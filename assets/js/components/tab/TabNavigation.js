import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

export default class TabNavigation extends Component {

  render() {
    const {dashboard, createTab, dashboard_settings, togglePreview} = this.props
    const currentId = this.props.tab.id
    const items = dashboard.tabs.map((tab) => (
      <Link to={`/tab/${tab.id}`} className={ (currentId == tab.id) ? 'item active active blue' : 'item' }>{tab.name}</Link>
    ))
    var create_tab;
    if (!dashboard_settings.preview)
        create_tab = (<a className="item" onClick={createTab}>Create Tab</a>)
    return (
      <div className="ui large menu inverted">
        {create_tab}
        {items}
        <div className="right menu">
          <div className="ui toggle item checkbox">
            <input type="checkbox" name="newsletter" onClick={togglePreview} defaultValue={dashboard_settings.preview}/>
            <label></label>
          </div>
        </div>
      </div>
    )
  }
}
