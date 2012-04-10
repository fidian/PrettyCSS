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
		'warnings': ['should_not_be_quoted']
	},
	'initial': {
		'tokens': ['IDENT'],
		'toString': 'initial',
		'unparsed': [],
		'warnings': ['reserved_for_future_use']
	},
	'default inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'default',
		'unparsed': ['IDENT'],
		'warnings': ['reserved_for_future_use']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
