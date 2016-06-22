import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import _ from 'underscore'

export default class DatasetList extends Component {

  constructor(props) {
    super(props)

    this.deleteDataset = this.deleteDataset.bind(this)
    this.createDataset = this.createDataset.bind(this)
    this.deleteSource= this.deleteSource.bind(this)
  }

  deleteSource(e) {
    console.log(this.props)
    this.props.deleteSource(e.target.id)
  }

  deleteDataset(e) {
    console.log(this.props)
    this.props.deleteDataset(e.target.id)
  }
  
  createDataset(e) {
    var source = e.target.id
    this.props.createDataset(source)
  }

  render() {
    const {datasets, sources, createSource} = this.props
    var items
    if (!_.isEmpty(datasets)) {
      var groupedDatasets = _.groupBy(datasets, function (e) {
        return e.source 
      })
      items = _.pairs(groupedDatasets)
      items = items.concat(_.difference(sources.map(function(e) { return e.id }), _.keys(groupedDatasets)).map(function (x) {
       return [x, []] 
      }))
      items = items.map(function (key) {
        var subset = key[1].map(function (dataset) {
           if (_.isUndefined(dataset.lifecycle)) {
            return (
              <div>
                <Link to={`/dataset/${dataset.id}`} id={dataset.id} className="">{dataset.name}</Link> | 
                {moment(dataset.updatedAt).fromNow()} | <a onClick={this.deleteDataset} id={dataset.id}>Delete</a>
              </div>
            )
           } else {
            return (
              <div>
                {dataset.name} -- Lifecycle
              </div>
            )
           }
        }.bind(this))
        var namer = _.find(sources, function(e) { return e.id == key[0].toString() })
        if (namer != null) {
          namer = namer.name
        }
        return (
          <div className="">
            <h3><Link to={`/source/${key[0]}`} className="">{namer}</Link></h3>
            <span id={key[0]} onClick={this.deleteSource}>Delete</span> 
            <a className="" id={key[0]} onClick={this.createDataset}>+Dataset</a>
            <hr/>
            {subset} 
          </div>
        )
      }.bind(this))
    } 
    return (
      <div className="">
        <a className="item content fullPlus" onClick={createSource}>+Source</a>
        {items}
      </div>
    )
  }
}