var request = require('request')
var Papa = require('papaparse')

module.exports = {

  start: function (room_id, source, obj, raw_params, callback) {
  
    request.get(source.url, function(err, r, body){
        if (!err && r.statusCode == "200") {
            var val = Papa.parse(body, {header: true}).data
            callback({ list: val })
        } else {
            callback({error: [{message: err}] })
        }
    })
  },

  stop: function(){
  
  }

}