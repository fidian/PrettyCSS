"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-ornaments', {
	'ornaments()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'ornaments( serif ) inherit': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'ornaments(serif)',
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
