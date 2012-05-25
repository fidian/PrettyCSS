"use strict";
var util = require('./util');

exports.batch = util.makeVows('steps', {
	'steps(123)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'steps(123, end)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'steps(123, end)',
		'unparsed': [],
		'warnings': []
	},
	'steps(123, strt)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
