"use strict";
var util = require('./util');

exports.batch = util.makeVows('col-width', {
	'* mountain': {
		'tokens': ['CHAR', 'S', 'IDENT'],
		'toString': '*',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'minmax(1em,2px)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(1em, 2px)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'-7em': {
		'tokens': ['UNIT'],
		'toString': '-7em',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'require-positive-value']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
