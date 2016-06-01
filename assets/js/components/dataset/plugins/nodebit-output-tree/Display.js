import React, {Component} from 'react'

export default class Display extends Component {

  render() {
    const {controls, data} = this.props
    var rows = data.map(function(row) {
      console.log("this row", row)
      return (<div>{row.header}</div>)
    })
    return (
      <div className="ui">
        {rows}
      </div>
    )
  }

}
