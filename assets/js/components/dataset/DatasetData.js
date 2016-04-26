import React, {Component, PropTypes} from 'react'

import JsonTable from 'react-json-table'
import SQLEditor from '../../components/SQLEditor'

export default class DatasetData extends Component {

  render() {
    const {updateSQL, sql, data} = this.props
    var table;
    if (typeof data !== "undefined" && data.length > 0) {
      table = (
        <div className="sixteen column wide scroll">
          <JsonTable rows={data} columns={Object.keys(data[0])} className="dataTable"/>
        </div>
      )
    }
    return (
      <div className="row">
          <div className="sixteen column wide">
            <SQLEditor sql={sql} updateSQL={updateSQL}/>
          </div>
          {table}
      </div>
    )
  }
}

DatasetData.propTypes = {
  sql: PropTypes.string,
  data: PropTypes.array
}
