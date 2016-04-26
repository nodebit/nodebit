import React, {Component, PropTypes} from 'react'

export default class SourceDropdown extends Component {

  constructor(props) {
    super(props)

    this.submit = this.submit.bind(this)
  }

  submit(e) {
    e.preventDefault()
    this.props.submit(this.refs.source.value)
  }

  render() {
    const {sources, source} = this.props
    const options = sources.map(source => (
      <option value={source.id}>{source.host}</option>
    ))
    return (
      <form className="ui form" onSubmit={this.submit}>
        <div className="inline fields">
          <select ref="source" defaultValue={source}>
            {options}
          </select>
          <input type="submit" value="Save" className="ui button"/>
        </div>
      </form>
    )
  }

}
