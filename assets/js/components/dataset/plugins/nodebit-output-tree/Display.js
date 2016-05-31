import React, {Component} from 'react'

export default class Stat extends Component {

  render() {
    const {controls, data} = this.props
    var stat_value = data[0][controls.value]
    var rows = data.map(function(row){
      return (<div>{row}</div>)
    })
    return (
      <div className="ui">
        {rows}
      </div>
    )
  }

}
