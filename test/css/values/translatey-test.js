"use strict";
var util = require('./util');

exports.batch = util.makeVows('translatey', {
	'translateY(10px) blue': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'translateY(10px)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'translateY(blue)': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
