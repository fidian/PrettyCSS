"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-delay', {
	'1.0s': {
		'tokens': ['UNIT'],
		'toString': '1.0s',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'4s, 5ms, blue': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'IDENT'],
		'toString': '4s, 5ms',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
