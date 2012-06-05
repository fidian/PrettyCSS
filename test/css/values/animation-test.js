"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation', {
	'ease': {
		'tokens': ['IDENT'],
		'toString': 'ease',
		'unparsed': [],
		'warnings': []
	},
	'ease, ease': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease, ease',
		'unparsed': [],
		'warnings': []
	},
	// One is animation name, the other is transition
	'ease ease': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'ease ease',
		'unparsed': [],
		'warnings': []
	},
	'ease inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'ease',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'U+82': {
		'tokens': ['UNICODE_RANGE'],
		'toString': null,
		'unparsed': ['UNICODE_RANGE'],
		'warnings': null
	}
});
