"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-family-single', {
	'Serif': {
		'tokens': ['IDENT'],
		'toString': 'Serif',
		'unparsed': [],
		'warnings': []
	},
	// Tricky - see comment in code for font-family-name
	'monospace inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'monospace inherit',
		'unparsed': [],
		'warnings': []
	},
	'inherit 10em': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'inherit',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'1deg': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
