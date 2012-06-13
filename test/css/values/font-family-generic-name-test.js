"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-family-generic-name', {
	'serif': {
		'tokens': ['IDENT'],
		'toString': 'serif',
		'unparsed': [],
		'warnings': []
	},
	'"sans-serif"': {
		'tokens': ['STRING'],
		'toString': '"sans-serif"',
		'unparsed': [],
		'warnings': ['remove-quotes']
	},
	'initial': {
		'tokens': ['IDENT'],
		'toString': 'initial',
		'unparsed': [],
		'warnings': ['reserved']
	},
	'default inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'default',
		'unparsed': ['IDENT'],
		'warnings': ['reserved']
	},
	'Serif': {
		'tokens': ['IDENT'],
		'toString': 'serif',  // Lowercase
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
