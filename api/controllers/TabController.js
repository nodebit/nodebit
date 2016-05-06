module.exports = {
  findRecord: function(req, res) {
    Tab.findOne({id: req.param('id')}).exec(function found(err, record) {
      async.series([
        function (pcall) {
          Filter.find({tab: req.param('id')}).exec(function found(err2, filters) {
            record.filters = filters
            pcall()
          })
        }
        ,
        function (pcall) {
          Panel.find({tab: req.param('id')}).exec( function found(err2, panels) {
            async.map(panels, function(panel, callback) {
              Data.findOne({id: panel.data}).exec(function found(err4, data) {

                if (panel.filter_parameters) {
                  var scoped_filter_parameters = panel.filter_parameters.map(function(fp) {
                      var filter_value = record.filters.find(function (filter) {
                          return filter.id == fp.filter
                      }).value
                      var parameter_type = data.parameters.find(function (params) {
                          return params.name == fp.parameter
                      }).type
                      return {name: fp.parameter, value: filter_value, type: parameter_type}
                  })
                  data.withDataAndParams(scoped_filter_parameters, function (fullData) {
                    var returned = {dataset: fullData, id: panel.id, style: panel.style, filter_parameters: panel.filter_parameters}
                    callback(null, returned);
                  })
                }

                data.withData(function (fullData) {
                  // Do I need this at all?
                  if (typeof panel.filter_parameters !== 'undefined'){
                    returned.filter_parameters = panel.filter_parameters
                  }
                  var returned = {dataset: fullData, id: panel.id, style: panel.style}
                  callback(null, returned);
                });
              });
            }, function(err, result) {
              console.log(err)
              record.panels = result;
              pcall()
            });
          });
        }
      ], function complete() {
        res.ok(record);
      })

    });
  }
}
