"use strict";
var util = require('./util');

exports.batch = util.makeVows('scale', {
	'scale(10)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scale(10)',
		'unparsed': [],
		'warnings': []
	},
	'scale(7, .105)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scale(7, .105)',
		'unparsed': [],
		'warnings': []
	},
	'scale(10%)': {
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
