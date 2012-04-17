"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-repeat', {
	'no-repeat': {
		'tokens': ['IDENT'],
		'toString': 'no-repeat',
		'unparsed': [],
		'warnings': []
	},
	'repeat no-repeat blah': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'repeat',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'no-repeat, repeat, blah': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'no-repeat, repeat',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit, repeat-x': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2']
	},
	'repeat-x, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'repeat-x, inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'inherit-not-allowed']
	},
	'code-monkey': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
