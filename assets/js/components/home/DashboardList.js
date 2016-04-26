import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

export default class DashboardList extends Component {

  render() {
    const {dashboards, deleteDashboard, createDashboard} = this.props

    const dashboard_cards = dashboards.map(function (e, i) {
      return (
        <div className="card" key={e.id}>
          <div className="ui content segments">
            <div className="header">{e.name}</div>
            <div className="meta">
              <a onClick={deleteDashboard} id={e.id}>Delete</a>
            </div>
          </div>
          <Link to={`/dashboard/${e.id}`} key={e.id} className="ui button primary attached bottom">Open Dashboard</Link>
        </div>
      );
    }.bind(this))

    return (
      <div>
        <div className="ui cards">
          <div className="card purple inverted">
            <a className="item content fullPlus" onClick={createDashboard}>+Dashboard</a>
          </div>
          {dashboard_cards}
        </div>
      </div>
    )
  }

}

DashboardList.propTypes = {
  dashboards: PropTypes.array.isRequired,
  deleteDashboard: PropTypes.func.isRequired
}
