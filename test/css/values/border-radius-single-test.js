"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-radius-single', {
	'1em': {
		'tokens': ['UNIT'],
		'toString': '1em',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'3% -10pt': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '3% -10pt',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'require-positive-value']
	},
	'67% comma_and_garbage': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '67%',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
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
