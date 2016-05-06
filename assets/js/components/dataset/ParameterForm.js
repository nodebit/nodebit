import React, {Component, PropTypes} from 'react'

export default class DatasetParameters extends Component {

  constructor(props) {
    super(props)

    this.updateParameter = this.updateParameter.bind(this)
    this.removeParameter = this.removeParameter.bind(this)
  }

  updateParameter(e) {
    e.preventDefault()
    const {index} = this.props
    this.props.updateParameter(index, this.refs.name.value, this.refs.type.value, this.refs.value.value)
  }

  removeParameter(e) {
    e.preventDefault()
    const {index} = this.props
    console.log(index)
    this.props.removeParameter(index)
  }

  render() {
    const {parameter, index} = this.props
    const variable_types = ['int', 'varchar', 'date']
    const options = variable_types.map((type) => (
      <option value={type} key={type}>{type}</option>
    ))
    return (
      <form className="ui form" key={index} id={index} onSubmit={this.updateParameter}>
        <div className="field">
          <label>Name:</label>
          <input type="text" ref="name" defaultValue={parameter.name}/>
        </div>
        <div className="field">
          <label>Type:</label>
          <select ref="type" defaultValue={parameter.type}>
            {options}
          </select>
        </div>
        <div className="field">
          <label>Value:</label>
          <input type="text" ref="value" defaultValue={parameter.value}/>
        </div>
        <div className="field">
          <button className="ui button" onClick={this.removeParameter}>Remove</button>
          <input type="submit" value="Save" className="ui button"/>
        </div>
      </form>
    )
  }

}
