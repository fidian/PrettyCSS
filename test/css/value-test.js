"use strict";
var vows = require('vows');
var value = require('../../lib/css/value');
var util = require('./util');

exports.batch = vows.describe('lib/css/value.js').addBatch({
	'value-simple.css': util.tokenizeFile({
		'value-simple.json': util.compareResult(value)
	}),
	'value-eob.css': util.tokenizeFile({
		'value-eob.json': util.compareResult(value)
	}),
	'value-ws-eof.css': util.tokenizeFile({
		'value-ws-eof.json': util.compareResult(value)
	})
});
