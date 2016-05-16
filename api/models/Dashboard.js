
module.exports = {
  attributes: {
    tabs: {
      collection: 'tab',
      via: 'dashboard'
    }
  },
  afterDestroy: function (destroyedRecords, cb) {
    Tab.destroy({ dashboard: _.pluck(destroyedRecords, 'id')}).exec(cb)
  }
}
