"use strict";
var util = require('./util');

exports.batch = util.makeVows('width', {
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
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': []
	},
	'15%': {
		'tokens': ['UNIT'],
		'toString': '15%',
		'unparsed': [],
		'warnings': []
	},
	'-15%': {
		'tokens': ['UNIT'],
		'toString': '-15%',
		'unparsed': [],
		'warnings': ['require-positive-value']
	},
	'10px inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '10px',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2.1']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
