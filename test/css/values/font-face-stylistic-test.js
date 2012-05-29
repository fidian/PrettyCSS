"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-stylistic', {
	'stylistic()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'stylistic( serif ) inherit': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'stylistic(serif)',
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
