"use strict";
var util = require('./util');

exports.batch = util.makeVows('margin', {
	'1em': {
		'tokens': ['UNIT'],
		'toString': '1em',
		'unparsed': [],
		'warnings': []
	},
	'1em 2em': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1em 2em',
		'unparsed': [],
		'warnings': []
	},
	'1em 2em 3em': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1em 2em 3em',
		'unparsed': [],
		'warnings': []
	},
	'1em 2em 3em 4em': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1em 2em 3em 4em',
		'unparsed': [],
		'warnings': []
	},
	'1em 2em 3em 4em 5em': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1em 2em 3em 4em',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'1em, 2em': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT'],
		'toString': '1em',
		'unparsed': ['OPERATOR', 'S', 'UNIT'],
		'warnings': []
	},
	'1em inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '1em inherit',
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
