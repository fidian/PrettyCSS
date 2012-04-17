"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-color', {
	'blue': {
		'tokens': ['IDENT'],
		'toString': 'blue',
		'unparsed': [],
		'warnings': []
	},
	'blue red green idaho': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'blue red green',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'blue, red, yellow': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'blue',
		'unparsed': ['OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'green transparent yellow blue red': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'green transparent yellow blue',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'transparent blue': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'transparent blue',
		'unparsed': [],
		'warnings': []
	},
	'transparent': {
		'tokens': ['IDENT'],
		'toString': 'transparent',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'green inherit blue red': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'green inherit blue red',
		'unparsed': [],
		'warnings': ['inherit-not-allowed']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
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
