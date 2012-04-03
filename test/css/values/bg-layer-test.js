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
	}
});
