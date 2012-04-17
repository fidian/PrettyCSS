"use strict";
var util = require('./util');

exports.batch = util.makeVows('counter', {
	'counters(mcmacken,"smacky",square)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'STRING', 'OPERATOR', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'counters(mcmacken, "smacky", square)',
		'unparsed': [],
		'warnings': []
	},
	'counters( inherit , "smacky" )': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'OPERATOR', 'S', 'STRING', 'S', 'PAREN_CLOSE'],
		'toString': 'counters(inherit, "smacky")',
		'unparsed': [],
		'warnings': ['inherit-not-allowed']
	},
	'counter(mcmacken,square) balloon': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'counter(mcmacken, square)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'counter( bubbly )': {
		'tokens': ['FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE'],
		'toString': 'counter(bubbly)',
		'unparsed': [],
		'warnings': []
	},
	'counter( bubbly': {
		'tokens': ['FUNCTION', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['FUNCTION', 'S', 'IDENT'],
		'warnings': null
	},
	// Inherit isn't allowed anywhere for this object
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
