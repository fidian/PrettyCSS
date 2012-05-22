"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-color-stop', {
	'color-stop(0.3, blue)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'color-stop(0.3, blue)',
		'unparsed': [],
		'warnings': []
	},
	'color-stop(1%, blue)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'color-stop(1%, blue)',
		'unparsed': [],
		'warnings': []
	},
	'from(blue) blah': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'from(blue)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'to(blue)': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'to(blue)',
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
