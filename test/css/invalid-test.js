"use strict";
var vows = require('vows');
var invalid = require('../../lib/css/invalid');
var util = require('./util');

exports.batch = vows.describe('lib/css/invalid.js').addBatch({
	'invalid-semicolon.css': util.tokenizeFile({
		'invalid-semicolon.json': util.compareResult(invalid)
	}),
	'invalid-close-block.css': util.tokenizeFile({
		'invalid-close-block.json': util.compareResult(invalid)
	}),
	'invalid-with-block.css': util.tokenizeFile({
		'invalid-with-block.json': util.compareResult(invalid)
	})
});
