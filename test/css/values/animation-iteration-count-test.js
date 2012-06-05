"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-iteration-count', {
	'7': {
		'tokens': ['UNIT'],
		'toString': '7',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'7 8': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '7',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'7, 8': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': '7, 8',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'7 inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '7',
		'unparsed': ['IDENT'],
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
