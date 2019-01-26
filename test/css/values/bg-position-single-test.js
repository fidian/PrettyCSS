"use strict";

var util = require('./util');

exports.batch = util.makeVows('bg-position-single', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	// 'top' is invalid for background-position-x and background-position-y
	'top': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'top right': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'left': {
		'tokens': ['IDENT'],
		'toString': 'left',
		'unparsed': [],
		'warnings': []
	},
	'right': {
		'tokens': ['IDENT'],
		'toString': 'right',
		'unparsed': [],
		'warnings': []
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': []
	},
	// 'bottom' is invalid for background-position-x and background-position-y
	'bottom': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'1em': {
		'tokens': ['UNIT'],
		'toString': '1em',
		'unparsed': [],
		'warnings': []
	},
	'20%': {
		'tokens': ['UNIT'],
		'toString': '20%',
		'unparsed': [],
		'warnings': []
	},
	'50% 25%': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '50%',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'40px 100px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '40px',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'100px 50%': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '100px',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	}
});
