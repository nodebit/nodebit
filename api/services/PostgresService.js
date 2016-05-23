var pg = require('pg')
var named = require('node-postgres-named')

module.exports = {

  start: function(room_id, source, dataset, raw_params, callback) {
    console.log("not suprisingly we have a socket")

    var conString = "postgres://" + source.user + ":" + source.password + "@" + source.host + "/" + source.database;
    var client = new pg.Client(conString)
    named.patch(client)
    client.connect()


    var params = {}
    if (raw_params) {
      params = _.object(raw_params.map(function (para) {
        return [para.name, para.value]
      }))
    }

    try {
      console.log("ok postgres query attempted")
      client.query(dataset.sql, params, function (err, result) {
        if (err) {
          console.log("ok postgres query returned")
          callback({error: [{ message: err.message }]})
        } else {
          callback({list: result.rows })
        }
      })
    } catch (e) {
      console.log(e.message)
      callback({error: [{ message: e.message }]})
    }
    

  }

}
