var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var Papa = require("papaparse");
var request = require('request');
var sql = require('seriate')

/**
 * DataController
 *
 * @description :: Server-side logic for managing data
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

	find: function (req, res) {
		function parseSelect(req) {
			var select = req.param('select') || req.options.select;
			if (typeof select == 'undefined') {return undefined;}
			if (typeof select == 'string') {
				try {
					select = JSON.parse(select);
				} catch(e) {}
			}
			return select;
		}

		// Look up the model
		var Model = actionUtil.parseModel(req);

		// Lookup for records that match the specified criteria
		var query;
    if (typeof parseSelect(req) != 'undefined' ) {
      query = Model.find({select: parseSelect(req)});
    } else {
      query = Model.find().populate("charts");
    }

		query.exec(function found(err, matchingRecords) {
			if (err) return res.serverError(err);

			// Only `.watch()` for new instances of the model if
			// `autoWatch` is enabled.
			if (req._sails.hooks.pubsub && req.isSocket) {
				Model.subscribe(req, matchingRecords);
				if (req.options.autoWatch) { console.log("yup should watch"); Model.watch(req); }
				// Also subscribe to instances of all associated models
				_.each(matchingRecords, function (record) {
					actionUtil.subscribeDeep(req, record);
				});
			}

			res.ok(matchingRecords);
		});
	},
  findRecord: function(req, res) {
		// set a default connection pool

    Data.findOne({id: req.param('id')}).exec(function found(err, record) {
			record.withData(function (complete) {
				res.ok(complete);
			});
    });
  },
	updateSql: function (req, res) {
			console.log(req.body);
			Data.update({id: req.params.id}, {sql: req.body.sql }).exec(function created(err, updated) {
				console.log("sql updated");
				Data.findOne({id: updated[0].id}).exec(function found(err, record) {
					record.withData(function (complete) {
						res.ok(complete);
					});
				});
			});
	},
	createParameter: function (req, res) {
			console.log(req.body);
			Data.findOne(req.params.id).exec(function (err, dataset) {
				const new_parameter = { name: '', value: '', type: '' }
				if (typeof dataset.parameters !== 'undefined') {
			   dataset.parameters.push(new_parameter)
			 } else {
			   dataset.parameters = [new_parameter]
			 }
		   dataset.save(function (err, dataset) { res.ok({}) })
		 })
	},
	create: function (req, res) {
		var Model = actionUtil.parseModel(req);

		// Create data object (monolithic combination of all parameters)
		// Omit the blacklisted params (like JSONP callback param, etc.)
		var params = actionUtil.parseValues(req);

		// Create new instance of model using data from params
		Data.create(params).exec(function created (err, newInstance) {

			// Differentiate between waterline-originated validation errors
			// and serious underlying issues. Respond with badRequest if a
			// validation error is encountered, w/ validation info.
			if (err) return res.negotiate(err);
			// Gather the data
      console.log(params)
			if (params.type == "URL") {
	      if (params.url != null) {
	        request.get(params.url, function(err, r, body){
	          if (!err && r.statusCode == "200") {
	            var val = Papa.parse(body, {header: true}).data;
	            Data.update({id: newInstance.id}, {data: val}).exec(function created(err, updated) {
	              console.log("data pulled")
	              res.created(newInstance);
	            });
	          } else {
	            Data.destroy({id: newInstance.id}).exec( function() {
	              console.log("data pull failed")
	              console.log(err);
	              res.badRequest();
	            });
	          }
	        });
	      } else {
		      res.badRequest();
	      }
			} else {
				res.created(newInstance);
			}
		});
	}
};
