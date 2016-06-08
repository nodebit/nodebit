import React, {Component, PropTypes} from 'react'

export default class SingleValueForm extends Component {

  constructor(props) {
    super(props)

    this.submit = this.submit.bind(this)
  }

  submit(e) {
    e.preventDefault()
    if (this.props.id) {
      this.props.submit(this.refs.name.value, this.refs.name.id)
    } else {
      this.props.submit(this.refs.name.value)
    }
    this.refs.name.blur()
  }

  render() {
    const { initialValue, id, type} = this.props
    return (
      <form className="ui form" onSubmit={this.submit}>
        <div className="inline fields">
          <input type="text" id={id} ref="name" defaultValue={initialValue} className={type}/>
        </div>
      </form>
    )
  }

}
