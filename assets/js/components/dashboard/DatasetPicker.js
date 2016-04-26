import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import moment from 'moment'

export default class DatasetPicker extends Component {

  constructor(props) {
    super(props)

    this.addDataset = this.addDataset.bind(this)
  }

  addDataset(e) {
    this.props.addDataset(e.target.id)
  }

  render() {
    const {datasets} = this.props
    const items = datasets.map(function(e, i) {
      return (
        <div className="card" key={e.id}>
          <div className="ui content segments">
            <div className="header">{e.name}</div>
          </div>
          <a onClick={this.addDataset} id={e.id} className="ui button primary attached bottom">Add Dataset</a>
        </div>
      );
    }.bind(this))
    return (
      <div className="ui cards">
        {items}
      </div>
    )
  }
}

DatasetPicker.propTypes = {
  datasets: PropTypes.array.isRequired
}
