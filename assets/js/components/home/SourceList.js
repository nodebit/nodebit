import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import moment from 'moment'

export default class SourceList extends Component {

  constructor(props) {
    super(props)

    this.deleteSource= this.deleteSource.bind(this)
  }

  deleteSource(e) {
    console.log(this.props)
    this.props.deleteSource(e.target.id)
  }

  render() {
    const {sources, createSource} = this.props
    const items = sources.map(function(e, i) {
      return (
        <div className="card" key={e.id}>
          <div className="ui content segments">
            <div className="header">{e.name}</div>
            <div className="meta">{moment(e.updatedAt).fromNow()}
              | <a id={e.id} onClick={this.deleteSource}>Delete</a>
              <a className="ui blue tiny label">{e.type}</a>
            </div>
          </div>
          <Link to={`/source/${e.id}`} id={e.id} className="ui button primary attached bottom">View Dataset</Link>
        </div>
      );
    }.bind(this))
    return (
      <div className="ui cards">
        <div className="card purple inverted">
          <a className="item content fullPlus" onClick={createSource}>+Source</a>
        </div>
        {items}
      </div>
    )
  }
}
