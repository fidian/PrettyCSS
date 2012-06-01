"use strict";
var util = require('./util');

exports.batch = util.makeVows('color-stop', {
	'blue': {
		'tokens': ['IDENT'],
		'toString': 'blue',
		'unparsed': [],
		'warnings': []
	},
	'blue yellow': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'blue',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'green 1px blah': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': 'green 1px',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'green 1%': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'green 1%',
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
