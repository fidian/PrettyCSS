"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-style', {
	'all': {
		'tokens': ['IDENT'],
		'toString': 'all',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'all, bold': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'all',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'italic, oblique': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'italic, oblique',
		'unparsed': [],
		'warnings': ['not-forward-compatible:3', 'css-minimum:2', 'css-unsupported:2.1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1', 'inherit-not-allowed']
	},
	'illegalValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
