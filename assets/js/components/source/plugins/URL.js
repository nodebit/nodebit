import React, {Component, PropTypes} from 'react'

export default class URL extends Component {

  constructor(props) {
    super(props)

    this.updateSource = this.updateSource.bind(this)
  }

  updateSource(e) {
    e.preventDefault()
    var url = this.refs.url.value
    var name = this.refs.name.value
    
    const postable = {
      url: url,
      name: name
    }
    
    if (name != "" && url != "") {
      this.props.updateSource(postable, true)
    }
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
          <button className="ui button primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}
