"use strict";
var util = require('./util');

exports.batch = util.makeVows('transform', {
	'inherit none': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'translateX(1%)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'translateX(1%)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'translateX(1%) translateY(2%) translateZ(3)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE', 'S', 'FUNCTION', 'UNIT', 'PAREN_CLOSE', 'S', 'FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'translateX(1%) translateY(2%)',
		'unparsed': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
