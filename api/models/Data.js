/**
* Data.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var sql = require('seriate');
var pg = require('pg')
var named = require('node-postgres-named')

module.exports = {

  attributes: {
    type: {
      type: 'string',
      enum: ['DB', 'URL']
    },
    source: {
      model: 'source'
    },
    withDataAndParams: function(raw_params, callback) {
      var obj = this.toObject();
      if (obj.type == "DB" && typeof obj.sql !== "undefined") {
        Source.findOne({id: obj.source}).exec( function (err, sql_source){
          var conString = "postgres://" + sql_source.user + ":" + sql_source.password + "@" + sql_source.host + "/" + sql_source.database;
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
            client.query(obj.sql, params, function (err, result) {
              if (err) {
                obj.errors = [{ message: err.message }]
              } else {
                obj.data = result.rows
              }
              callback(obj)
            })
          } catch (e) {
            obj.errors = [{message: e.message}]
            callback(obj)
          }

        })
      } else {
          callback(obj);
      }

    },
    withData: function (callback) {
      var obj = this.toObject();
      this.withDataAndParams(obj.parameters,callback)
    }
  }, afterDestroy: function(destroyedRecords, cb) {
    Panel.destroy({ data: _.pluck(destroyedRecords, 'id') }).exec(cb)
  }

};
