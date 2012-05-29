"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-stretch', {
	'all': {
		'tokens': ['IDENT'],
		'toString': 'all',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'expanded': {
		'tokens': ['IDENT'],
		'toString': 'expanded',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'expanded inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'expanded',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'expanded condensed': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'expanded',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'expanded, condensed': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'expanded, condensed',
		'unparsed': [],
		'warnings': ['not-forward-compatible:3', 'css-minimum:2', 'css-unsupported:2.1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
