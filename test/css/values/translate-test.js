"use strict";
var util = require('./util');

exports.batch = util.makeVows('translate', {
	'translate(1%) blue': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'translate(1%)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'translate(1%, 2em)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'translate(1%, 2em)',
		'unparsed': [],
		'warnings': []
	},
	'translate(blue)': {
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
