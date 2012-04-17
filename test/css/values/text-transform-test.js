"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-transform', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': []
	},
	'capitalize': {
		'tokens': ['IDENT'],
		'toString': 'capitalize',
		'unparsed': [],
		'warnings': []
	},
	'capitalize full-width blahblah': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'capitalize full-width',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'full-size-kana': {
		'tokens': ['IDENT'],
		'toString': 'full-size-kana',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
