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
    const {filters, createFilter, updateFilterName, updateFilterValue, dashboard_settings, toggleFilters} = this.props
    var new_filter;
    if (!dashboard_settings.preview) {
      new_filter = (
        <button className="ui button" onClick={createFilter}>New Filter</button>
      )
    }
    const openFilters = filters.map(function(filter) {
      var name;
      var remove_filter;

      if (!dashboard_settings.preview) {
        name = (
          <SingleValueForm
            id={filter.id}
            initialValue={filter.name}
            submit={updateFilterName}
          />
        )
        remove_filter = (
          <div className="column four wide">
            <button className="ui button" id={filter.id} onClick={this.removeFilter}>Remove Filter</button>
          </div>
        )
      }
      return (
        <div>
          <div className="column four wide">
            {filter.name}
            {name}
          </div>
          <div className="column four wide">
            {filter.value}
            <SingleValueForm
              id={filter.id}
              initialValue={filter.value}
              submit={updateFilterValue}
            />
          </div>
          {remove_filter}
        </div>
      )
    }.bind(this))
    var filters_panel_class = "content";
    if (dashboard_settings.filters)
      filters_panel_class += " active"

    return (
      <div className="ui accordion breatheBottom">
        <div className="title active" onClick={toggleFilters}>
          <i class="dropdown icon"></i>
          <strong>Filters:</strong>
        </div>
        <div className={filters_panel_class}>
          <div class="ui grid">
            {new_filter}
            {openFilters}
          </div>
        </div>
      </div>
    )
  }
}
