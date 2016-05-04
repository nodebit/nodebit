import React, {Component, PropTypes} from 'react'

export default class ParameterFilter extends Component {

  constructor(props) {
    super(props)

    this.updateParameterFilter = this.updateParameterFilter.bind(this)
  }

  updateParameterFilter(e) {
    e.preventDefault()
    const {parameter} = this.props
    const filter_id = this.refs.filter.value
    this.props.updateParameterFilter(parameter.name, filter_id)
  }

  render() {
    const {parameter, filters, setFilter} = this.props

    const avaliable_filters = filters.map((filter) => (
      <option value={filter.id}>{filter.name}</option>
    ))
    return (
      <form onSubmit={this.updateParameterFilter}>
        <div>{parameter.name}</div>
        <select ref="filter" defaultValue={setFilter}>
          {avaliable_filters}
        </select>
        <input type="submit" className="ui field" value="Map"/>
      </form>
    )
  }

}
