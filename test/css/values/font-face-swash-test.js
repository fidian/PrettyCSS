"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-swash', {
	'swash()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'swash( serif ) inherit': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'swash(serif)',
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
