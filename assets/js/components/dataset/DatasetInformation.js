import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import moment from 'moment'

import SingleValueForm from '../common/Form'
import SourceDropdown from './SourceDropdown'
import DatasetParameters from './DatasetParameters'

export default class DatasetInformation extends Component {

  constructor(props) {
    super(props)

    this.updateName = this.updateName.bind(this)
    this.updateSource = this.updateSource.bind(this)
  }

  updateName(name) {
    const postable = {name: name }
    this.props.updateDataset(postable)
  }

  updateSource(source_id) {
    const postable = {source: source_id}
    this.props.updateDataset(postable, true)
  }


  render() {
    const {name, data, id, updatedAt, createParameter, updateParameter, removeParameter, parameters, createdAt, url, type, changeType, sources, source} = this.props
    return (
      <div>
        <h1 className="ui header">{name}</h1>
        <div className="ui header">
          <h3>Source Information:</h3>
          <SingleValueForm submit={this.updateName}/>
          <SourceDropdown
            submit={this.updateSource}
            sources={sources}
            source={source}
          />
        </div>
        <div className="ui attached segment">
          <div className="ui list">
            <div className="item"><strong>Updated: </strong>{updatedAt}</div>
            <div className="item"><strong>Added: </strong>{createdAt}</div>
          </div>
        </div>
        <div className="ui attached segment">
          <DatasetParameters
            createParameter={createParameter}
            updateParameter={updateParameter}
            removeParameter={removeParameter}
            parameters={parameters}
          />
        </div>
      </div>
    )
  }
}

DatasetInformation.propTypes = {
  name: PropTypes.string
}
