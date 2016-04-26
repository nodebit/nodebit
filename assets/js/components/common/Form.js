import React, {Component, PropTypes} from 'react'

export default class SingleValueForm extends Component {

  constructor(props) {
    super(props)

    this.submit = this.submit.bind(this)
  }

  submit(e) {
    e.preventDefault()
    this.props.submit(this.refs.name.value)
  }

  render() {
    return (
      <form className="ui form" onSubmit={this.submit}>
        <div className="inline fields">
          <input type="text" ref="name"/>
          <input type="submit" value="Save" className="ui button"/>
        </div>
      </form>
    )
  }

}
