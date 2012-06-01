"use strict";
var util = require('./util');

exports.batch = util.makeVows('clip', {
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'auto inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'auto',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'rect(1px,2px,3px,4px)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rect(1px, 2px, 3px, 4px)',
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
