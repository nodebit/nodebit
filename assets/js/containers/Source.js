require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import _ from 'underscore'

class Source extends Component {

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
      database: this.refs.database.value
    }
    io.socket.put("/source/" + this.props.params.id, postable, function (data) {
      console.log(data)
    }.bind(this))
  }

  render() {
    const {source} = this.props
    var block
    if (!_.isEmpty(source)) {
      block = (
        <div className="ui grid">
          <div className="row">
            <div className="column four wide">
              <form className="ui form" onSubmit={this.updateSource}>
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
          </div>
        </div>
      )
    } else {
      block = (
        <div className="ui active dimmer">
          <div className="ui loader"></div>
        </div>
      )
    }
    return block
  }

}

export default connect(function(state, ownProps) {
  const source = state.sources.find((source) => source.id = ownProps.params.id)
  return { source: source }
})(Source)
