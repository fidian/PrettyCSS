"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-duration', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1s 2s': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1s',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'2s, 3s': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': '2s, 3s',
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
