"use strict";
var util = require('./util');

exports.batch = util.makeVows('translatex', {
	'translateX(10px) blue': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'translateX(10px)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'translateX(blue)': {
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
