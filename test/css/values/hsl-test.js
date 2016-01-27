"use strict";
var util = require('./util');

exports.batch = util.makeVows('hsl', {
	'hsl(1, 2, 3)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'hsl(1, 2, 3)',
		'unparsed': [],
		'warnings': []
	},
	'hsl( 4 ,5% ,6% ) hsl(asdf)': {
		'tokens': ['FUNCTION', 'S', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'PAREN_CLOSE', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'hsl(4, 5%, 6%)',
		'unparsed': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'warnings': []
	},
	'hsl(7,8%,9)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'hsl(7, 8%, 9)',
		'unparsed': [],
		'warnings': ['mixing-percentages']
	},
	'hsl(red, green, blue)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
    // First value must be a number
	'hsl(-7%,888%,0.9)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
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
