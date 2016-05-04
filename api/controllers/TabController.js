module.exports = {
  findRecord: function(req, res) {
    Tab.findOne({id: req.param('id')}).exec(function found(err, record) {
      Panel.find({tab: req.param('id')}).exec( function found(err2, panels) {
        async.map(panels, function(panel, callback) {
          Data.findOne({id: panel.data}).exec(function found(err4, data) {
            data.withData(function (fullData) {
              callback(null, {dataset: fullData, id: panel.id, style: panel.style});
            });
          });
        }, function(err, result) {
          console.log(err)
          record.panels = result;
    			res.ok(record);
        });

      });

    });
  }
}
