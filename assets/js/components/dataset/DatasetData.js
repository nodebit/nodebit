import React, {Component, PropTypes} from 'react'

import SQLEditor from '../../components/SQLEditor'
import DatasetParameters from './DatasetParameters'

export default class DatasetData extends Component {

  render() {
    const {updateSQL, sql, data, createParameter, updateParameter, removeParameter, parameters} = this.props
    return (
      <div className="ui grid">
        <div className="row">
          <div className="twelve wide column">
            <SQLEditor sql={sql} updateSQL={updateSQL}/>
          </div>
          <div className="four wide column">
            <DatasetParameters
                createParameter={createParameter}
                updateParameter={updateParameter}
                removeParameter={removeParameter}
                parameters={parameters}
            />
          </div>
        </div>
      </div>
    )
  }
}