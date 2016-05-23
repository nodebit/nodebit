var request = require('request')

module.exports = {

  room_ids: {},

  start: function (room_id, source, obj, raw_params, callback) {
    var request_id = setInterval(function() {
      request.get("http://finance.google.com/finance/info?client=ig&q=AAPL", function(err, r, body){
        var raw_stock = JSON.parse(body.replace("//",""))
        console.log(raw_stock)
        var data_point = _.object(raw_stock.map(function(ticker) {
          return [ticker.ldts, ticker.t, ticker.l]
        }))
        callback({data: raw_stock[0]})
      })
    }, source.refresh)
    this.room_ids[room_id] = request_id
  },

  stop: function(room_id) {
    clearInterval(this.room_ids[room_id])
    delete this.room_ids[room_id]
  }

}
