"use strict";
var util = require('./util');

exports.batch = util.makeVows('rotate3d', {
	'rotate3d(7, .105, 12, 15deg)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rotate3d(7, .105, 12, 15deg)',
		'unparsed': [],
		'warnings': []
	},
	'rotate3d(10)': {
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
