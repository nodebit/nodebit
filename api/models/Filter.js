module.exports = {
  attributes: {
    tab: {
      model: 'tab'
    }
  }, afterDestroy: function(destroyedRows, cb){
    async.each(destroyedRows, function(filter, cb2) {
      const filter_id = filter.id
      Panel.find({tab: filter.tab}).exec (function (err, panels) {
        async.each(panels, function (panel, done) {
          if (typeof panel.filter_parameters !== "undefined" && panel.filter_parameters.length > 0) {
            var clean_filter_parameters = _.reject(panel.filter_parameters, function (filter_parameter) {
                return (filter_parameter.filter == filter_id)
            })
            panel.filter_parameters = clean_filter_parameters
            panel.save(done)
          }
        }, function () {
          cb2()
        })
      })
    }, function () {
        cb()
    })
  }
}
