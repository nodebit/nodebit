import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import SingleValueForm from '../common/Form'

export default class Filters extends Component {

  constructor(props) {
    super(props)

    this.removeFilter = this.removeFilter.bind(this)
  }

  removeFilter(e) {
    e.preventDefault()
    this.props.removeFilter(e.target.id)
  }

  render() {
    const {filters, createFilter, updateFilterName, updateFilterValue} = this.props
    const openFilters = filters.map((filter) => (
        <div className="ui grid">
          <div className="column four wide">
            {filter.name}
            <SingleValueForm
              id={filter.id}
              initialValue={filter.name}
              submit={updateFilterName}
            />
          </div>
          <div className="column four wide">
            {filter.value}
            <SingleValueForm
              id={filter.id}
              initialValue={filter.value}
              submit={updateFilterValue}
            />
          </div>
          <div className="column four wide">
            <button className="ui button" id={filter.id} onClick={this.removeFilter}>Remove Filter</button>
          </div>
        </div>
    ))
    return (
      <div>
        <button className="ui button" onClick={createFilter}>New Filter</button>
        {openFilters}
      </div>
    )
  }
}
