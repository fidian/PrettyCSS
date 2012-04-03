"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-layer', {
	'repeat-x': {
		'tokens': ['IDENT'],
		'toString': 'repeat-x',
		'unparsed': [],
		'warnings': []
	},
	'scroll url(a) blue': {
		'tokens': ['IDENT', 'S', 'URL', 'S', 'IDENT'],
		'toString': 'scroll url(a) blue',
		'unparsed': [],
		'warnings': []
	},
	'elephant': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Second color isn't valid
	'blue red': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'blue',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'center / 20% border-box padding-box': {
		'tokens': ['IDENT', 'S', 'OPERATOR', 'S', 'UNIT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'center / 20% border-box padding-box',
		'unparsed': [],
		'warnings': []
	},
	'top/3em border-box blue, url(a)': {
		'tokens': ['IDENT', 'OPERATOR', 'UNIT', 'S', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'URL'],
		'toString': 'top / 3em border-box blue',
		'unparsed': ['OPERATOR', 'S', 'URL'],
		'warnings': []
	}
});
