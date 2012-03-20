"use strict";
var vows = require('vows');
var block = require('../../lib/css/block');
var util = require('./util');

vows.describe('lib/css/block.js').addBatch({
	'block.css': util.tokenizeFile({
		'block.json': util.compareResult(block)
	}),
	'block-bad.css': util.tokenizeFile({
		'block-bad.json': util.compareResult(block)
	}),
	'block-nested.css': util.tokenizeFile({
		'block-nested.json': util.compareResult(block)
	}),
	'block-nested-bad.css': util.tokenizeFile({
		'block-nested-bad.json': util.compareResult(block)
	})
}).export(module);
