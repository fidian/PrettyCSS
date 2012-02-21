var vows = require('vows');
var ruleset = require('../../lib/css/ruleset')
var util = require('./util');

vows.describe('lib/css/ruleset.js').addBatch({
	'ruleset.css': util.tokenizeFile({
		'ruleset.json': util.compareResult(ruleset)
	}),
	'ruleset-multiple-selectors.css': util.tokenizeFile({
		'ruleset-multiple-selectors.json': util.compareResult(ruleset)
	}),
	'ruleset-no-block.css': util.tokenizeFile({
		'ruleset-no-block.json': util.compareResult(ruleset)
	}),
	'ruleset-no-close-block.css': util.tokenizeFile({
		'ruleset-no-close-block.json': util.compareResult(ruleset)
	}),
}).export(module);
