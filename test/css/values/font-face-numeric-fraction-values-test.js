"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-numeric-fraction-values', {
	'diagonal-fractions': {
		'tokens': ['IDENT'],
		'toString': 'diagonal-fractions',
		'unparsed': [],
		'warnings': []
	},
	'stacked-fractions inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'stacked-fractions',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
