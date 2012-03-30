"use strict";
var vows = require('vows');
var cdo = require('../../lib/css/cdo');
var util = require('./util');

exports.batch = vows.describe('lib/css/cdo.js').addBatch({
	'cdo.css': util.tokenizeFile({
		'cdo.json': util.compareResult(cdo)
	})
});
