"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-styleset', {
	'styleset()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'styleset("Wiggle", serif)': {
		'tokens': ['FUNCTION', 'STRING', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'styleset("Wiggle", serif)',
		'unparsed': [],
		'warnings': []
	},
	'styleset( serif ) inherit': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'styleset(serif)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
