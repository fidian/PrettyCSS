"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-family-name', {
	'valid': {
		'tokens': ['IDENT'],
		'toString': 'valid',
		'unparsed': [],
		'warnings': []
	},
	'"a" b c': {
		'tokens': ['STRING', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': '"a"',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'a "b" c': {
		'tokens': ['IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'toString': 'a',
		'unparsed': ['STRING', 'S', 'IDENT'],
		'warnings': []
	},
	'a b "c"': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'STRING'],
		'toString': 'a b',
		'unparsed': ['STRING'],
		'warnings': []
	},

	// Whitespace in non-quoted names are reduced to a single space
	'Times   New      Roman': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'Times New Roman',
		'unparsed': [],
		'warnings': []
	},
	'"Times   New   Roman"': {
		'tokens': ['STRING'],
		'toString': '"Times   New   Roman"',
		'unparsed': [],
		'warnings': [],
	},

	// Inherit is treated as a regular font-family-name
	'inherit, valid': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'valid, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'valid',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	}
});
