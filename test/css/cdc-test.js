"use strict";
var vows = require('vows');
var cdc = require('../../lib/css/cdc');
var util = require('./util');

vows.describe('lib/css/cdc.js').addBatch({
	'cdc.css': util.tokenizeFile({
		'cdc.json': util.compareResult(cdc)
	})
}).export(module);
