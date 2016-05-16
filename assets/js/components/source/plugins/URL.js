import React, {Component, PropTypes} from 'react'

export default class URL extends Component {

  constructor(props) {
    super(props)

    this.updateSource = this.updateSource.bind(this)
  }

  updateSource(e) {
    e.preventDefault()
    const postable = {
      url: this.refs.url.value,
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
            <label>URL: </label>
            <input type="text" ref="url" defaultValue={source.url}/>
          </div>
          <button className="ui button" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}
