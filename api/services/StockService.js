var request = require('request')

module.exports = {

  room_ids: {},

  start: function (room_id, source, obj, raw_params, callback) {
    console.log('going the distance')
    request.get("http://finance.google.com/finance/info?client=ig&q=AAPL,YHOO", function(err, r, body){
      console.log(err, r, body)
      //callback({data: {x: Math.floor(Math.random() * 6), y: new Date().valueOf()}})
    })
    this.room_ids[room_id] = "mnu"
  },

  stop: function(room_id) {
    delete this.room_ids[room_id]
  }

}
