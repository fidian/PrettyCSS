"use strict";
var util = require('./util');

exports.batch = util.makeVows('min-length', {
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'-10% blah': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '-10%',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'require-positive-value']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
