"use strict";
var vows = require('vows');
var property = require('../../lib/css/property');
var util = require('./util');

vows.describe('lib/css/property.js').addBatch({
	'property.css': util.tokenizeFile({
		'property.json': util.compareResult(property)
	}),
	'property-eof.css': util.tokenizeFile({
		'property-eof.json': util.compareResult(property)
	}),
	'property-ws.css': util.tokenizeFile({
		'property-ws.json': util.compareResult(property)
	})
}).export(module);
