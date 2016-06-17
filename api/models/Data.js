/**
* Data.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
    type: {
      type: 'string',
      enum: ['DB', 'URL']
    },
    source: {
      model: 'source'
    },
    /*
    We are going to need to figure out how to push and rexecute only pieces of the 
    component structure 
    
    componentTree 
      -sourcetransformation output v
      -transformation should start from previous dataset and only reload belwo
    */
    withDataAndParams: function(raw_params, req, callback) {
      var obj = this.toObject();
      if (typeof obj.source !== "undefined") {
        Source.findOne({id: obj.source}).exec( function (err, source) {
          // create a socket to communicate data
          var room_id = Math.floor((Math.random() * 10000) + 1)
          req.socket.join(room_id)

          //the is the callback to push data to the client
          var v = function (obj) {
            obj.room_id = room_id
            sails.io.sockets.to(room_id).emit('message', obj)
          }

          obj.room_id = room_id
          obj.data = []
          callback(obj)

          console.log(source.type)
          if (source.type == "streaming") {
            StreamService.start(room_id, source, obj, raw_params, v)
          } else if (source.type == "postgres") {
            PostgresService.start(room_id, source, obj, raw_params, v)
          } else if (source.type == "oanda") {
            OandaService.start(room_id, source, obj, raw_params, v)
          } else if (source.type == "url") {
            URLService.start(room_id, source, obj, raw_params, v)
          } else if (source.type == "sql-server") {
            SqlServerService.start(room_id, source, obj, raw_params, v)
          } else if (source.type == "stock") {
            StockService.start(room_id, source, obj, raw_params, v)
          }
        })
      } else {
          callback(obj);
      }
    },
    withData: function (req, callback) {
      var obj = this.toObject();
      this.withDataAndParams(obj.parameters, req, callback)
    }
  }, afterDestroy: function(destroyedRecords, cb) {
    Panel.destroy({ data: _.pluck(destroyedRecords, 'id') }).exec(cb)
  }

};
