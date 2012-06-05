"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-single', {
	'1s': {
		'tokens': ['UNIT'],
		'toString': '1s',
		'unparsed': [],
		'warnings': []
	},
	'ease ease': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'ease ease',
		'unparsed': [],
		'warnings': []
	},
	'ease, ease': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ease',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'this-is-not-invalid-it-is-an-animation-name': {
		'tokens': ['IDENT'],
		'toString': 'this-is-not-invalid-it-is-an-animation-name',
		'unparsed': [],
		'warnings': []
	},
	'U+888': {
		'tokens': ['UNICODE_RANGE'],
		'toString': null,
		'unparsed': ['UNICODE_RANGE'],
		'warnings': null
	}
});
