"use strict";
var util = require('./util');

exports.batch = util.makeVows('rotate', {
	'rotate(10deg)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rotate(10deg)',
		'unparsed': [],
		'warnings': []
	},
	'rotate(7deg, .105deg)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'rotate(10%)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
