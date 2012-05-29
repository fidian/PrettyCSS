"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-historical-lig-values', {
	'historical-ligatures': {
		'tokens': ['IDENT'],
		'toString': 'historical-ligatures',
		'unparsed': [],
		'warnings': []
	},
	'no-historical-ligatures inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'no-historical-ligatures',
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
