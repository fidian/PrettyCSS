"use strict";
var util = require('./util');

exports.batch = util.makeVows('urange', {
	'U+5f': {
		'tokens': ['UNICODE_RANGE'],
		'toString': 'U+5f',
		'unparsed': [],
		'warnings': []
	},
	'U+02468A-13579B blah': {
		'tokens': ['UNICODE_RANGE', 'S', 'IDENT'],
		'toString': 'U+02468A-13579B',
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
