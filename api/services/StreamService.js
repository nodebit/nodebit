module.exports = {

  room_ids: {},

  start: function (room_id, source, obj, raw_params, callback) {
    var request_id = setInterval(function() {
      //push new data
      console.log("pushing new point")
      callback({data: {x: Math.floor(Math.random() * 6), y: new Date().valueOf()}})
    }, 1000)
    this.room_ids[room_id] = request_id
  },

  stop: function(room_id) {
    clearInterval(this.room_ids[room_id])
    delete this.room_ids[room_id]
  }

}
