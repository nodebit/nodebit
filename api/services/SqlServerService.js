var sql = require('seriate')

module.exports = {

  start: function(room_id, source, dataset, raw_params, callback) {
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
    db_conf.name = source.id
    sql.addConnection(db_conf)
    sql.getPlainContext(source.id)
    .step("getData", {
        query: dataset.sql,
        params: params
    })
    .end(function(sets) {
        callback({list: sets.getData});
    })
    .error(function(err) {
        console.log(err);
        callback({error: [{message: err.message}]});
    })
  }

}
