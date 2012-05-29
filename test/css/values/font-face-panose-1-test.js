"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-panose-1', {
	'1 2 3 4 5 6 7 8 9 10': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1 2 3 4 5 6 7 8 9 10',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'1 2 3 4.02 5 6 7 8 9 10': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'warnings': null
	},
	'1 2 3 4 5 6 7 8 9': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'warnings': null
	},
	'1 2 3 4 5 6 7 8 9 10 11': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1 2 3 4 5 6 7 8 9 10',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
