"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-size', {
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': []
	},
	'-7em': {
		'tokens': ['UNIT'],
		'toString': '-7em',
		'unparsed': [],
		'warnings': ['require-positive-value']
	},
	'xx-small': {
		'tokens': ['IDENT'],
		'toString': 'xx-small',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'medium large': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'medium',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
