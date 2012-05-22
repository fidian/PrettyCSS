"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-single', {
	'all': {
		'tokens': ['IDENT'],
		'toString': 'all',
		'unparsed': [],
		'warnings': []
	},
	'ease all banana': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'ease all',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'all ease': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'all ease',
		'unparsed': [],
		'warnings': []
	},
	'U+1234': {
		'tokens': ['UNICODE_RANGE'],
		'toString': null,
		'unparsed': ['UNICODE_RANGE'],
		'warnings': null
	}
});
