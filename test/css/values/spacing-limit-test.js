"use strict";
var util = require('./util');

exports.batch = util.makeVows('spacing-limit', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'120% inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '120%',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'normal 12em 3em 100%': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'normal 12em 3em',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
