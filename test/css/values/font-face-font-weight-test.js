"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-weight', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'800, inherit': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'IDENT'],
		'toString': '800',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'all, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'all',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'all inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'all',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'normal, 900, 800, 700, 500, 100': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': 'normal, 900, 800, 700, 500, 100',
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
