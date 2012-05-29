"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-unicode-range', {
	'U+177': {
		'tokens': ['UNICODE_RANGE'],
		'toString': 'U+177',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'U+123, U+456, inherit': {
		'tokens': ['UNICODE_RANGE', 'OPERATOR', 'S', 'UNICODE_RANGE', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'U+123, U+456',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
