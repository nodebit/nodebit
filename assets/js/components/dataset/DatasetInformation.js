import React, {Component} from 'react'
import moment from 'moment'

import SingleValueForm from '../common/Form'

export default class DatasetInformation extends Component {

  constructor(props) {
    super(props)

    this.updateName = this.updateName.bind(this)
  }

  updateName(name) {
    const postable = {name: name }
    this.props.updateDataset(postable)
  }

  render() {
    const {name, data, id, updatedAt, createParameter, updateParameter, removeParameter, parameters, createdAt, url, type, changeType, sources, source} = this.props
    return (
      <div className="column sixteen wide">
        <SingleValueForm submit={this.updateName} initialValue={name} type="fieldHeader"/>
        <em>Updated: {moment(updatedAt).fromNow()}</em>
      </div>
    )
  }
}
