"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-bbox', {
	'1, 2, 3, 4': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': '1, 2, 3, 4',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'1, 2, 3': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'warnings': null
	},
	'1, 2, 3, 4, 5': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': '1, 2, 3, 4',
		'unparsed': ['OPERATOR', 'S', 'UNIT'],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'one, 2, 3, 4': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['IDENT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
