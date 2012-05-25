"use strict";
var util = require('./util');

exports.batch = util.makeVows('scale3d', {
	'scale3d(7, .105, 12)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scale3d(7, .105, 12)',
		'unparsed': [],
		'warnings': []
	},
	'scale3d(10)': {
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
