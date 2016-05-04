/**
* Data.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var sql = require('seriate');

module.exports = {

  attributes: {
    type: {
      type: 'string',
      enum: ['DB', 'URL']
    },
    source: {
      model: 'source'
    },
    withData: function (callback) {
      var obj = this.toObject();
      if (obj.type == "DB" && typeof obj.sql !== "undefined") {
        Source.findOne({id: obj.source}).exec( function (err, sql_source){
        	const defaults = {
            "pool": {
          		"max": 10,
          		"min": 4,
          		"idleTimeoutMillis": 30000
          	}
          }
          var params = {}
          if (obj.parameters) {
            params = _.object(obj.parameters.map(function (para) {
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

          console.log(sql_source)
          var db_conf = _.extend(defaults, sql_source)
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
          });
        })
      } else {
          callback(obj);
      }
    }
  }
};
