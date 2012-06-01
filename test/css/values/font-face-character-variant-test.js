"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-character-variant', {
	'character-variant()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'character-variant( serif ) inherit': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'character-variant(serif)',
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
