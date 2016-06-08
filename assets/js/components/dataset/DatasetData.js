import React, {Component, PropTypes} from 'react'

import SQLEditor from '../../components/SQLEditor'

export default class DatasetData extends Component {

  render() {
    const {updateSQL, sql, data} = this.props
    var table;
    if (typeof data !== "undefined" && data.length > 0) {
    }
    return (
          <div className="sixteen column wide">
            <SQLEditor sql={sql} updateSQL={updateSQL}/>
          </div>
    )
  }
}