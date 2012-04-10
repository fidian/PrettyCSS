"use strict";
var util = require('./util');

exports.batch = util.makeVows('minmax', {
	'minmax(*,*)': {
		'tokens': ['FUNCTION', 'CHAR', 'OPERATOR', 'CHAR', 'PAREN_CLOSE'],
		'toString': 'minmax(*, *)',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'minmax(max-content,min-content) garbage': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'minmax(max-content, min-content)',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'minmax(76em,1px)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(76em, 1px)',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'minmax(76em,1em)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(76em, 1em)',
		'unparsed': [],
		'warnings': ['minmax_p_greater_than_q', 'minimum_css_version_3']
	},
	// inherit is invalid
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
