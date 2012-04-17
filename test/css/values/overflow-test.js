"use strict";
var util = require('./util');

exports.batch = util.makeVows('overflow', {
	'visible': {
		'tokens': ['IDENT'],
		'toString': 'visible',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	// Could be tricky, but should be parsed as CSS2
	'visible garbage': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'visible',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	// The CSS3 warning is on overflow-dimension
	'scroll scroll': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'scroll scroll',
		'unparsed': [],
		'warnings': []
	},
	'scroll scroll scroll': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'scroll scroll',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Back to CSS2 and standard test scenarios
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
