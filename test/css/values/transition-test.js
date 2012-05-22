"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition', {
	'inherit abc': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'ease, all': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease, all',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'U+99': {
		'tokens': ['UNICODE_RANGE'],
		'toString': null,
		'unparsed': ['UNICODE_RANGE'],
		'warnings': null
	}
});
