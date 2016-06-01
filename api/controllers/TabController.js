var _ = require('underscore');

module.exports = {
  findRecord: function(req, res) {
    Tab.findOne({id: req.param('id')}).populateAll().exec(function found(err, record) {
      async.map(record.panels, function(panel, callback) {
        if (panel.data.indexOf("plugin") !== -1) {
        
          var pluginType = panel.data.replace("plugin/","")
          var pluginLocation = pluginType.charAt(0).toUpperCase() + pluginType.slice(1) + "LifecycleService"
          var room_id = Math.floor((Math.random() * 10000) + 1)
          req.socket.join(room_id)

          //the is the callback to push data to the client
          var v = function (obj) {
            obj.room_id = room_id
            sails.io.sockets.to(room_id).emit('message', obj)
          }

          var obj = {}
          obj.room_id = room_id
          obj.data = []
          obj.output = pluginType
          obj.name = pluginType
          panel.dataset = obj
          callback(null, panel)

          setTimeout (function () {
            eval(pluginLocation + ".start(room_id, {}, obj, [], v)")
          }, 2000)
                    
        } else {
          Data.findOne({id: panel.data}).exec(function found(err4, data) {
            var params = []

            // need to map over the complete set of parameters for a dataset
            if (typeof data.parameters !== "undefined" && data.parameters.length > 0) {
              params = data.parameters.map(function(data_parameter) {
                // either grab it's filter parameter
                var filter_parameter;
                if (typeof panel.filter_parameters !== "undefined" && panel.filter_parameters.length > 0) {
                  filter_parameter = panel.filter_parameters.find(function (filter_parameter) {
                    return data_parameter.name == filter_parameter.parameter
                  })
                }

                if (filter_parameter != null) {
                  var filter_value = record.filters.find(function (filter) {
                    return filter.id == filter_parameter.filter
                  }).value
                  return { name: data_parameter.name, type: data_parameter.type, value: filter_value }
                } else {
                  return data_parameter
                }
              })
            }
            data.withDataAndParams(params, req, function(gotData) {
              panel.dataset = gotData
              callback(null, panel)
            })
          });
        }
      }, function(err, panels) {
        record.panels = panels
        res.ok(record)
      })
    });
  }
}
