"use strict";
var util = require('./util');

exports.batch = util.makeVows('expression', {
	'expression': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'expression()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': 'expression()',
		'unparsed': [],
		'warnings': ['browser-only:ie', 'browser-unsupported:ie8']
	},
	'expression(21 *7+"px")': {
		'tokens': ['FUNCTION', 'UNIT', 'S', 'CHAR', 'UNIT', 'COMBINATOR', 'STRING', 'PAREN_CLOSE'],
		'toString': 'expression(21 *7+"px")',
		'unparsed': [],
		'warnings': ['browser-only:ie', 'browser-unsupported:ie8']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
