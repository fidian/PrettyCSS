"use strict";
var vows = require('vows');
var whitespace = require('../../lib/css/whitespace');
var util = require('./util');

exports.batch = vows.describe('lib/css/whitespace.js').addBatch({
	'whitespace.css': util.tokenizeFile({
		'whitespace.json': util.compareResult(whitespace)
	})
});
