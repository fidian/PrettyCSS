"use strict";
var util = require('./util');

exports.batch = util.makeVows('rgb', {
	'rgb(1, 2, 3)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rgb(1, 2, 3)',
		'unparsed': [],
		'warnings': []
	},
	'rgb( 4% ,5% ,6% ) rgb(asdf)': {
		'tokens': ['FUNCTION', 'S', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'OPERATOR', 'UNIT', 'S', 'PAREN_CLOSE', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'rgb(4%, 5%, 6%)',
		'unparsed': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'warnings': []
	},
	'rgb(7,8%,9%)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rgb(7, 8%, 9%)',
		'unparsed': [],
		'warnings': ['mixing-percentages']
	},
	'rgb(-7%,888%,0.9)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rgb(0%, 100%, 1)',
		'unparsed': [],
		'warnings': ['mixing-percentages', 'range-min:0', 'range-max:100', 'require-integer']
	},
	'rgb(red, green, blue)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
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
