"use strict";
var util = require('./util');

exports.batch = util.makeVows('opacity', {
	'0.2': {
		'tokens': ['UNIT'],
		'toString': '0.2',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'0': {
		'tokens': ['UNIT'],
		'toString': '0',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1 0': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'1.01': {
		'tokens': ['UNIT'],
		'toString': '1',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'range-max:1']
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
