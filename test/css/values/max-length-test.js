"use strict";
var util = require('./util');

exports.batch = util.makeVows('max-length', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
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
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
