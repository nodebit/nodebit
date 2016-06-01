import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import moment from 'moment'

export default class DatasetList extends Component {

  constructor(props) {
    super(props)

    this.deleteDataset = this.deleteDataset.bind(this)
  }

  deleteDataset(e) {
    console.log(this.props)
    this.props.deleteDataset(e.target.id)
  }

  render() {
    const {datasets, createDataset} = this.props
    const items = datasets.map(function(e, i) {
      if (typeof e.lifecycle == "undefined") {
        return (
          <div className="card" key={e.id}>
            <div className="ui content segments">
              <div className="header">{e.name}</div>
              <div className="meta">{moment(e.updatedAt).fromNow()} |  <a onClick={this.deleteDataset} id={e.id}>Delete</a></div>
              <div className="description">
              </div>
            </div>
            <Link to={`/dataset/${e.id}`} id={e.id} className="ui button primary attached bottom">View Dataset</Link>
          </div>
        )
      } else {
        return (
          <div className="card" key={e.id}>
            <div className="ui content segments">
              <div className="header">{e.name}</div>
              <div className="description">
              </div>
            </div>
          </div>
        )
      }
    }.bind(this))
    return (
      <div className="ui cards">
        <div className="card purple inverted">
          <a className="item content fullPlus" onClick={createDataset}>+Dataset</a>
        </div>
        {items}
      </div>
    )
  }
}

DatasetList.propTypes = {
  datasets: PropTypes.array.isRequired
}
