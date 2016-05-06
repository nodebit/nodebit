module.exports = {
  findRecord: function(req, res) {
    console.log("this is the id", req.param('id'))
    Dashboard.findOne({id: req.param('id')}).exec(function found(err, record) {

      Tab.find({dashboard: req.param('id')}).exec(function found(err, tabs) {
        console.log(err)
        record.tabs = tabs
        res.ok(record)
      })
    });
  }
}
