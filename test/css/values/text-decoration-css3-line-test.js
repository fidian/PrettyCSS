"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-css3-line', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': []
	},
	'overline underline oddoline': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'overline underline',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'overline, underline, oddoline': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'overline',
		'unparsed': ['OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	// Inherit is not valid
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
