"use strict";
var util = require('./util');

exports.batch = util.makeVows('o-linear-gradient', {
	'-o-linear-gradient(blue, red)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-o-linear-gradient(blue, red)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-o-linear-gradient(top, white, gray, white)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-o-linear-gradient(top, white, gray, white)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-o-linear-gradient(top left, black)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': '-o-linear-gradient(top left, black)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-o-linear-gradient(top, boogers)': {
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
