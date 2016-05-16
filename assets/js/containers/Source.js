require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import Postgres from '../components/source/plugins/Postgres'
import URL from '../components/source/plugins/URL'

import _ from 'underscore'

class Source extends Component {

  constructor(props) {
    super(props)

    this.updateSource = this.updateSource.bind(this)
    this.setSourceType = this.setSourceType.bind(this)
    this.getSource = this.getSource.bind(this)
  }

  componentWillUnmount() {
    console.log("relieve source")
  }

  componentDidMount() {
    this.getSource()
  }

  getSource() {
    io.socket.get("/source/" + this.props.params.id, function (data) {
      console.log(data)
      this.props.dispatch({type: 'RECIEVE_SOURCE', source: data})
    }.bind(this))
  }

  updateSource(postable) {
    io.socket.put("/source/" + this.props.params.id, postable, function (data) {
      this.getSource()
    }.bind(this))
  }

  setSourceType(e) {
    e.preventDefault()
    const postable = {type: this.refs.sourceType.value}
    this.updateSource(postable)
  }

  render() {
    const {source} = this.props
    var block
    if (!_.isEmpty(source)) {
      if (typeof source.type == "undefined") {
        block = (
          <div className="ui grid">
            <div className="row">
              <form onSubmit={this.setSourceType}>
                <select ref="sourceType">
                  <option value="sql-server">SQL Server</option>
                  <option value="postgres">PostgreSQL</option>
                  <option value="url">URL</option>
                </select>
                <input type="submit" className="ui button"/>
              </form>
            </div>
          </div>
        )
      } else {
        if (source.type == "postgres") {
          block = (<Postgres source={source} updateSource={this.updateSource}/>)
        } else if (source.type == "sql-server") {
          block = (<Postgres source={source} updateSource={this.updateSource}/>)
        } else if (source.type == "url") {
          block = (<URL source={source} updateSource={this.updateSource}/>)
        }
      }
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
  return { source: state.source }
})(Source)
