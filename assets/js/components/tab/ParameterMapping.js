import React, {Component, PropTypes} from 'react'

import ParameterFilter from './ParameterFilter'

export default class ParameterMapping extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {filters, dataset, filter_parameters, updateParameterFilter} = this.props
    var avaliable_params
    console.log(filters, "filters")
    if (dataset.parameters) {
      avaliable_params = dataset.parameters.map(function(param) {
        var setFilter
        if (filter_parameters) {
          setFilter = filter_parameters.find((fp) => (
            fp.parameter == param.name
          ))
          if (setFilter) {
            setFilter = setFilter.filter
          }
        }
        return (
          <ParameterFilter
            parameter={param}
            filters={filters}
            setFilter={setFilter}
            updateParameterFilter={updateParameterFilter}
          />
        )
      })
    } else {
      avaliable_params = (<div>No avaliable parameters to map</div>)
    }
    return (
      <div>
        {avaliable_params}
      </div>
    )
  }

}
