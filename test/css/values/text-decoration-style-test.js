"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-style', {
	'solid': {
		'tokens': ['IDENT'],
		'toString': 'solid',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'double dotted': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'double',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'wavy inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'wavy',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
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
