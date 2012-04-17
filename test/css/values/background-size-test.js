"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-size', {
	'cover': {
		'tokens': ['IDENT'],
		'toString': 'cover',
		'unparsed': [],
		'warnings': []
	},
	'cover auto blah': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'cover',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'cover, auto, blah': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'cover, auto',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'inherit, cover': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2']
	},
	// bg-size does not match "inherit"
	'cover, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'cover',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'I dent': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': null
	}
});
