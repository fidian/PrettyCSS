"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-contextual-lig-values', {
	'contextual-ligatures': {
		'tokens': ['IDENT'],
		'toString': 'contextual-ligatures',
		'unparsed': [],
		'warnings': []
	},
	'no-contextual-ligatures inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'no-contextual-ligatures',
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
