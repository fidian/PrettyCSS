"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-transform-case', {
	'capitalize': {
		'tokens': ['IDENT'],
		'toString': 'capitalize',
		'unparsed': [],
		'warnings': []
	},
	'uppercase lowercase': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'uppercase',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Inherit isn't allowed
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
