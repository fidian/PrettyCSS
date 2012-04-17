"use strict";
var util = require('./util');

// Extra special since nothing is officially valid
exports.batch = util.makeVows('filter', {
	'alpha(12)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'alpha(opacity=12)': {
		'tokens': ['FUNCTION', 'IDENT', 'MATCH', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'alpha(opacity=12)',
		'unparsed': [],
		'warnings': []
	},

	// Wrong, but corrected
	'alpha(opacity:12)': {
		'tokens': ['FUNCTION', 'IDENT', 'COLON', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'alpha(opacity=12)',
		'unparsed': [],
		'warnings': ['filter-use-equals-instead']
	},

	// Invalid, but they look good-ish
	// Not yet corrected by the class
	'alpha(opacity=12%)': {
		'tokens': ['FUNCTION', 'IDENT', 'MATCH', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'MATCH', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'alpha(opacity:12%)': {
		'tokens': ['FUNCTION', 'IDENT', 'COLON', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'COLON', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},

	// The browser should see this as opacity=0
	'alpha(opacity=0.12)': {
		'tokens': ['FUNCTION', 'IDENT', 'MATCH', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'alpha(opacity=0.12)',
		'unparsed': [],
		'warnings': ['require-integer']
	},

	// Change : to =, and the browser should see this as opacity=0
	'alpha(opacity:.12)': {
		'tokens': ['FUNCTION', 'IDENT', 'COLON', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'alpha(opacity=.12)',
		'unparsed': [],
		'warnings': ['filter-use-equals-instead', 'require-integer']
	},

	// Unsure if inherit is supported by IE.  Probably shouldn't be used.
	// Treat as an invalid value.
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
