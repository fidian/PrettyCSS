"use strict";
var util = require('./util');

exports.batch = util.makeVows('z-index', {
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'999.9': {
		'tokens': ['UNIT'],
		'toString': '999.9',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'require-integer']
	},
	'-12 11': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '-12',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
