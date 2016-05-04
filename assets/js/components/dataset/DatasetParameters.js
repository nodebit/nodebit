import React, {Component, PropTypes} from 'react'

import ParameterForm from './ParameterForm'

export default class DatasetParameters extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {parameters, createParameter, updateParameter, removeParameter} = this.props
    var forms
    if (parameters) {
      forms = parameters.map((parameter, index) =>
        (
          <ParameterForm
            index={index}
            parameter={parameter}
            updateParameter={updateParameter}
            removeParameter={removeParameter}
          />
        )
      )
    }
    return (
      <div>
        <button className="ui button" onClick={createParameter}>Add Parameter</button>
        {forms}
      </div>
    )
  }

}
