"use strict";
var util = require('./util');

exports.batch = util.makeVows('widows-orphans', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'120% inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'IDENT'],
		'warnings': []
	},
	'17 blue': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '17',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'-1.7': {
		'tokens': ['UNIT'],
		'toString': '-1.7',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'require-integer', 'require-positive-value']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
