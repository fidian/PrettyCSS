"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-fill-mode', {
	'forwards': {
		'tokens': ['IDENT'],
		'toString': 'forwards',
		'unparsed': [],
		'warnings': []
	},
	'forwards forwards': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'forwards',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'forwards, forwards': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'forwards, forwards',
		'unparsed': [],
		'warnings': []
	},
	'forwards, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'forwards',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
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
