"use strict";
var util = require('./util');

exports.batch = util.makeVows('hsla', {
	'hsla(1, 2, 3, 0.4)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'hsla(1, 2, 3, 0.4)',
		'unparsed': [],
		'warnings': []
	},
	'hsla( 4% ,5% ,6% , 0.7 ) hsla(asdf)': {
		'tokens': ['FUNCTION', 'S', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'OPERATOR', 'S', 'UNIT', 'S', 'PAREN_CLOSE', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'hsla(4%, 5%, 6%, 0.7)',
		'unparsed': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'warnings': []
	},
	'hsla(7,8%,9%,1)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'hsla(7, 8%, 9%, 1)',
		'unparsed': [],
		'warnings': ['mixing-percentages']
	},
	'hsla(-7%,888%,0.9,1.001)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'hsla(0%, 100%, 1, 1)',
		'unparsed': [],
		'warnings': ['mixing-percentages', 'range-min:0', 'range-max:100', 'require-integer', 'range-max:1']
	},
	'hsla(red, green, blue, alpha)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	// inherit is not allowed
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
