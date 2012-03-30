"use strict";
var vows = require('vows');
var stylesheet = require('../../lib/css/stylesheet');
var util = require('./util');

exports.batch = vows.describe('lib/css/stylesheet.js').addBatch({
	'stylesheet-simple.css': util.tokenizeFile({
		'stylesheet-simple.json': util.compareResult(stylesheet)
	}),
	'stylesheet-bad-at-rule.css': util.tokenizeFile({
		'stylesheet-bad-at-rule.json': util.compareResult(stylesheet)
	})
});
