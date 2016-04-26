import React, {Component, PropTypes} from 'react'

export default class SQLEditor extends Component {

  constructor(props) {
    super(props)
    this.updateSQL = this.updateSQL.bind(this)
  }

  updateSQL() {
    this.props.updateSQL(this.refs.sql.value);
  }

  render() {
    const {sql} = this.props
    return (
      <div>
        <textarea ref="sql" defaultValue={sql} autoComplete="off" className="textEditor"/>
        <button className='ui button primary' onClick={this.updateSQL}>Update</button>
      </div>
    )
  }

}
