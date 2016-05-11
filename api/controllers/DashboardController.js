module.exports = {
  findRecord: function(req, res) {
    Dashboard.findOne({id: req.param('id')}).populateAll().exec(function found(err, record) {
      res.ok(record)
    });
  }
}
