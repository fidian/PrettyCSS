"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex-basis', {
	'10px': {
		'tokens': ['UNIT'],
		'toString': '10px',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'50%': {
		'tokens': ['UNIT'],
		'toString': '50%',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'-10px': {
		'tokens': ['UNIT'],
		'toString': '-10px',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10', 'require-positive-value']
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});


