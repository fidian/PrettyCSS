"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-transform', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
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
		'warnings': ['minimum_css_version_3']
	},
	'full-size-kana': {
		'tokens': ['IDENT'],
		'toString': 'full-size-kana',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
