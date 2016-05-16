
module.exports = {
  attributes: {
    panels: {
      collection: 'panel',
      via: 'tab'
    },
    dashboard: {
      model: 'dashboard'
    },
    filters: {
      collection: 'filter',
      via: 'tab'
    }
  },
  afterDestroy: function (destroyedRecords, cb) {
    Panel.destroy({ tab: _.pluck(destroyedRecords, 'id')}).exec(function () {
      Filter.destroy({ tab: _.pluck(destroyedRecords, 'id')}).exec(cb)
    })
  }
}
