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
	'Serif': {
		'tokens': ['IDENT'],
		'toString': 'Serif',
		'unparsed': [],
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
		'warnings': []
	},

	// Inherit is treated as a regular font-family-name
	// Tricky - see comment in code for font-family-name
	'inherit, valid': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['add-quotes']
	},
	'valid, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'valid',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'monospace inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'monospace inherit',
		'unparsed': [],
		'warnings': ['add-quotes']
	},
	'inherit 10em': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'inherit',
		'unparsed': ['UNIT'],
		'warnings': ['add-quotes']
	},

	// Capitalization matters
	'Arial': {
		'tokens': ['IDENT'],
		'toString': 'Arial',
		'unparsed': [],
		'warnings': []
	},
	'"Arial"': {
		'tokens': ['STRING'],
		'toString': '"Arial"',
		'unparsed': [],
		'warnings': []
	},

	// And now something that fails
	'1deg': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
