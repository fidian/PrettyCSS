"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-common-lig-values', {
	'common-ligatures': {
		'tokens': ['IDENT'],
		'toString': 'common-ligatures',
		'unparsed': [],
		'warnings': []
	},
	'no-common-ligatures inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'no-common-ligatures',
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
