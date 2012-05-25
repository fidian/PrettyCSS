"use strict";
var util = require('./util');

exports.batch = util.makeVows('moz-linear-gradient', {
	'-moz-linear-gradient(blue, red)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-moz-linear-gradient(blue, red)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-moz-linear-gradient(top, white, gray, white)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-moz-linear-gradient(top, white, gray, white)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-moz-linear-gradient(top left, black)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-moz-linear-gradient(top left, black)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-moz-linear-gradient(top, boogers)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	// inherit is invalid
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
