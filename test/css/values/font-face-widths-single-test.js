"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-widths-single', {
	'12': {
		'tokens': ['UNIT'],
		'toString': '12',
		'unparsed': [],
		'warnings': []
	},
	'1 2 3 auto inherit': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': '1 2 3',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'U+1207': {
		'tokens': ['UNICODE_RANGE'],
		'toString': null,
		'unparsed': ['UNICODE_RANGE'],
		'warnings': null
	},
	'U+1207 78': {
		'tokens': ['UNICODE_RANGE', 'S', 'UNIT'],
		'toString': 'U+1207 78',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
