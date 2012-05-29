"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-local', {
	'local(x)': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'local(x)',
		'unparsed': [],
		'warnings': []
	},
	'local(x   y)': {
		'tokens': ['FUNCTION', 'IDENT', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'local(x y)',
		'unparsed': [],
		'warnings': []
	},
	'local(x,y)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'IDENT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
