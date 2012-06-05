"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-name-single', {
	'avoid': {
		'tokens': ['IDENT'],
		'toString': 'avoid',
		'unparsed': [],
		'warnings': []
	},
	'auto inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'auto',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// inherit is just treated as another identifier
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'8em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
