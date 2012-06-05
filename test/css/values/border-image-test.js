"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'auto inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': null
	},
	'inherit auto': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'url(asdf.png) 7 2 3 / 8 90 /123': {
		'tokens': ['URL', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'OPERATOR', 'S', 'UNIT', 'S', 'UNIT', 'S', 'OPERATOR', 'UNIT'],
		'toString': 'url(asdf.png) 7 2 3 / 8 90 / 123',
		'unparsed': [],
		'warnings': []
	},
	'url(asdf.png) 7 2 3 //123 stretch stretch stretch': {
		'tokens': ['URL', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'OPERATOR', 'OPERATOR', 'UNIT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'url(asdf.png) 7 2 3 / / 123 stretch stretch',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'url(asdf.png) 7 2 3 / 8 90': {
		'tokens': ['URL', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'OPERATOR', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'url(asdf.png) 7 2 3 / 8 90',
		'unparsed': [],
		'warnings': []
	}
});
