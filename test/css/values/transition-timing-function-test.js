"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-timing-function', {
	'ease': {
		'tokens': ['IDENT'],
		'toString': 'ease',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'ease, ease': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease, ease',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'ease, please': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'none blue': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'none',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
