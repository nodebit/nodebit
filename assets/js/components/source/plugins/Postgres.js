import React, {Component, PropTypes} from 'react'

export default class Postgres extends Component {

  constructor(props) {
    super(props)

    this.updateSource = this.updateSource.bind(this)
  }

  updateSource(e) {
    e.preventDefault()
    const postable = {
      user: this.refs.user.value,
      password: this.refs.password.value,
      host: this.refs.host.value,
      database: this.refs.database.value,
      name: this.refs.name.value
    }
    this.props.updateSource(postable)
  }

  render() {
    const { source } = this.props
    return (
      <div className="column four wide">
        <form className="ui form" onSubmit={this.updateSource}>
          <div className="field">
            <label>Source Name: </label>
            <input type="text" ref="name" defaultValue={source.name}/>
          </div>
          <div className="field">
            <label>User: </label>
            <input type="text" ref="user" defaultValue={source.user}/>
          </div>
          <div className="field">
            <label>Password: </label>
            <input type="text" ref="password" defaultValue={source.password}/>
          </div>
          <div className="field">
            <label>Host: </label>
            <input type="text" ref="host" defaultValue={source.host}/>
          </div>
          <div className="field">
            <label>Database: </label>
            <input type="text" ref="database" defaultValue={source.database}/>
          </div>
          <button className="ui button" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}
