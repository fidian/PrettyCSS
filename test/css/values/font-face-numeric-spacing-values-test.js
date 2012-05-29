"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-numeric-spacing-values', {
	'tabular-nums': {
		'tokens': ['IDENT'],
		'toString': 'tabular-nums',
		'unparsed': [],
		'warnings': []
	},
	'proportional-nums inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'proportional-nums',
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
