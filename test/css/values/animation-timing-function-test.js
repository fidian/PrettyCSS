"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-timing-function', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'ease ease': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'ease',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'ease, ease': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease, ease',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
