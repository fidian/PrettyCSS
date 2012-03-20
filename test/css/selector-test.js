"use strict";
var vows = require('vows');
var selector = require('../../lib/css/selector');
var util = require('./util');

vows.describe('lib/css/selector.js').addBatch({
	'selector-single.css': util.tokenizeFile({
		'selector-single.json': util.compareResult(selector)
	}),
	'selector-multiple.css': util.tokenizeFile({
		'selector-multiple.json': util.compareResult(selector)
	}),
	'selector-eof.css': util.tokenizeFile({
		'selector-eof.json': util.compareResult(selector)
	}),
	'selector-class.css': util.tokenizeFile({
		'selector-class.json': util.compareResult(selector)
	}),
	'selector-combinator.css': util.tokenizeFile({
		'selector-combinator.json': util.compareResult(selector)
	}),
	'selector-combinator-2.css': util.tokenizeFile({
		'selector-combinator-2.json': util.compareResult(selector)
	}),
	'selector-error-combinator.css': util.tokenizeFile({
		'selector-error-combinator.json': util.compareResult(selector)
	}),
	'selector-error-combinator-2.css': util.tokenizeFile({
		'selector-error-combinator-2.json': util.compareResult(selector)
	}),
	'selector-error-colon-colon-ident.css': util.tokenizeFile({
		'selector-error-colon-colon-ident.json': util.compareResult(selector)
	}),
	'selector-error-colon-ident.css': util.tokenizeFile({
		'selector-error-colon-ident.json': util.compareResult(selector)
	})
}).export(module);
