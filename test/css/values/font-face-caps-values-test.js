"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-caps-values', {
	'small-caps': {
		'tokens': ['IDENT'],
		'toString': 'small-caps',
		'unparsed': [],
		'warnings': []
	},
	'petite-caps unicase': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'petite-caps',
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
