var request = require('request')
var Papa = require('papaparse')

module.exports = {

  start: function (room_id, source, obj, raw_params, callback) {
  
    //request.get("https://raw.githubusercontent.com/albertchang/CSV-to-flare.json-D3-parser/master/samples/taxonomy.en-US.csv", function(err, r, body){
        //if (!err && r.statusCode == "200") {
            var body = "header, status, footer\n1,3,4"
            var val = Papa.parse(body, {header: true}).data
            console.log(val)
            callback({ list: val })
        //} else {
        //    callback({error: [{message: err}] })
       // }
    //})
  },

  stop: function(){
  
  }

}