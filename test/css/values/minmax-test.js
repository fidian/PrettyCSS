"use strict";
var util = require('./util');

exports.batch = util.makeVows('minmax', {
	'minmax(*,*)': {
		'tokens': ['FUNCTION', 'CHAR', 'OPERATOR', 'CHAR', 'PAREN_CLOSE'],
		'toString': 'minmax(*, *)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'minmax(max-content,min-content) garbage': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'minmax(max-content, min-content)',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'minmax(76em,1px)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(76em, 1px)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'minmax(76em,1em)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(76em, 1em)',
		'unparsed': [],
		'warnings': ['minmax-p-q', 'css-minimum:3']
	},
	// inherit is invalid
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
