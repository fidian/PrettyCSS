"use strict";
var util = require('./util');

exports.batch = util.makeVows('translate3d', {
	'translate(1%, 2%, 3em) blue': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'translate(1%, 2%, 3em)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'translate(1em, 2%, 3em)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'translate(1em, 2%, 3em)',
		'unparsed': [],
		'warnings': []
	},
	'translate(1%, 2em, 3%)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'translate(1%, 2em, 3em)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'translate(1%, 2em, 3em)',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
