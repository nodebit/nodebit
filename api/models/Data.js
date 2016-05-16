/**
* Data.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var sql = require('seriate')
var pg = require('pg')
var named = require('node-postgres-named')
var request = require('request')
var Papa = require('papaparse')

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
        Source.findOne({id: obj.source}).exec( function (err, source){
          if (source.type == "sql-server") {
            const defaults = {
              "pool": {
                "max": 10,
                "min": 4,
                "idleTimeoutMillis": 30000
              }
            }
            var params = {}
            if (raw_params) {
              params = _.object(raw_params.map(function (para) {
                const type_map = {
                  'int': sql.INT,
                  'varchar': sql.VARCHAR
                }
                var val = para.value
                if (para.type == 'int') {
                  val = parseInt(para.value)
                }
                var bulk = {
                  val: val,
                  type: type_map[para.type]
                }
                return [para.name, bulk]
              }))
            }

            var db_conf = _.extend(defaults, source)
            db_conf.name = obj.source
            sql.addConnection(db_conf)
            sql.getPlainContext(obj.source)
            .step("getData", {
                query: obj.sql,
                params: params
            })
            .end(function(sets) {
                obj.data = sets.getData;
                callback(obj);
            })
            .error(function(err) {
                console.log(err);
                obj.errors = [{message: err.message}]
                callback(obj);
            })
          } else if (source.type == "postgres") {
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
          } else if (source.type == "url") {
            request.get(source.url, function(err, r, body){
               if (!err && r.statusCode == "200") {
                 var val = Papa.parse(body, {header: true}).data
                 obj.data = val
                 callback(obj)
               } else {
                 obj.errors = [{message: err}]
                 callback(obj)
               }
            })
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
