"use strict";
var vows = require('vows');
var atRule = require('../../lib/css/at-rule');
var util = require('./util');

vows.describe('lib/css/at-rule.js').addBatch({
	'at-rule-charset.css': util.tokenizeFile({
		'at-rule-charset.json': util.compareResult(atRule)
	}),
	'at-rule-charset-bad.css': util.tokenizeFile({
		'at-rule-charset-bad.json': util.compareResult(atRule)
	}),
	'at-rule-media.css': util.tokenizeFile({
		'at-rule-media.json': util.compareResult(atRule)
	}),
	'at-rule-media-bad.css': util.tokenizeFile({
		'at-rule-media-bad.json': util.compareResult(atRule)
	})
}).export(module);
