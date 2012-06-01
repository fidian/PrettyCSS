"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-discretionary-lig-values', {
	'discretionary-ligatures': {
		'tokens': ['IDENT'],
		'toString': 'discretionary-ligatures',
		'unparsed': [],
		'warnings': []
	},
	'no-discretionary-ligatures inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'no-discretionary-ligatures',
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
