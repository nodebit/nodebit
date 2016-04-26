module.exports = {
  findRecord: function(req, res) {
    Dashboard.findOne({id: req.param('id')}).exec(function found(err, record) {
      Panel.find({dashboard: req.param('id')}).exec( function found(err2, panels) {
        async.map(panels, function(panel, callback) {
          console.log(panel.data)
          Data.findOne({id: panel.data}).exec(function found(err4, data) {
            data.withData(function (fullData) {
              callback(null, {dataset: fullData});
            });
          });
        }, function(err, result) {
          record.panels = result;
    			res.ok(record);
        });

      });

    });
  }
}
