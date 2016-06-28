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
              <div className="item">
                <div className="content">
                  <div className="header">
                      <Link to={`/dataset/${dataset.id}`} id={dataset.id} className="">{dataset.name}</Link>
                    </div>
                    <div className="description">
                      {moment(dataset.updatedAt).fromNow()} | <a onClick={this.deleteDataset} id={dataset.id}>Delete</a>
                    </div>
                  </div>
              </div>
            )
           } else {
            return (
              <div className="item">
                {dataset.name}
              </div>
            )
           }
        }.bind(this))
        var namer = _.find(sources, function(e) { return e.id == key[0].toString() })
        if (namer != null) {
          namer = namer.name
        }
        return (
          <div className="ui segment vertical">
            <h3>
              <Link to={`/source/${key[0]}`} className="">{namer}</Link>
            </h3>
            <a className="ui button tiny positive" id={key[0]} onClick={this.createDataset}>Create {namer} Dataset</a>
            <a id={key[0]} className="ui red basic button tiny" onClick={this.deleteSource}>Delete All</a> 
            <div className="ui list relaxed large">
              {subset} 
            </div>
          </div>
        )
      }.bind(this))
    } 
    return (
      <div className="">
        <a className="ui button primary" onClick={createSource}>Add Source</a>
        <hr/>
        {items}
      </div>
    )
  }
}