"use strict";
var util = require('./util');

exports.batch = util.makeVows('linear-gradient', {
	'linear-gradient(blue, red)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'linear-gradient(blue, red)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'linear-gradient(25deg, white, gray, white)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'linear-gradient(25deg, white, gray, white)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'linear-gradient(to top, black)': {
		'tokens': ['FUNCTION', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'linear-gradient(to top, black)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'linear-gradient(top, black)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'linear-gradient(to top, boogers)': {
		'tokens': ['FUNCTION', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
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
