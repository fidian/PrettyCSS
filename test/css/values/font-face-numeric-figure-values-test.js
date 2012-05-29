"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-numeric-figure-values', {
	'lining-nums': {
		'tokens': ['IDENT'],
		'toString': 'lining-nums',
		'unparsed': [],
		'warnings': []
	},
	'oldstyle-nums inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'oldstyle-nums',
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
