"use strict";
var vows = require('vows');
var declaration = require('../../lib/css/declaration');
var util = require('./util');

vows.describe('lib/css/declaration.js').addBatch({
	'declaration.css': util.tokenizeFile({
		'declaration.json': util.compareResult(declaration)
	}),
	'declaration-block.css': util.tokenizeFile({
		'declaration-block.json': util.compareResult(declaration)
	}),
	'declaration-eof.css': util.tokenizeFile({
		'declaration-eof.json': util.compareResult(declaration)
	}),
	'declaration-ws.css': util.tokenizeFile({
		'declaration-ws.json': util.compareResult(declaration)
	}),
	'declaration-error-colon.css': util.tokenizeFile({
		'declaration-error-colon.json': util.compareResult(declaration)
	}),
	'declaration-novalue.css': util.tokenizeFile({
		'declaration-novalue.json': util.compareResult(declaration)
	})
}).export(module);
