"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-linear-gradient', {
	'-ms-linear-gradient(blue, red)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-ms-linear-gradient(blue, red)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-ms-linear-gradient(25deg, white, gray, white)': {
		'tokens': ['IDENT', 'CHAR', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-ms-linear-gradient(25deg, white, gray, white)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-ms-linear-gradient(top, black)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-ms-linear-gradient(top, black)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-ms-linear-gradient(top, boogers)': {
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
