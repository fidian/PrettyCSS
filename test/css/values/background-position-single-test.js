"use strict";

var util = require('./util');

exports.batch = util.makeVows('background-position-single', {
	'left': {
		'tokens': ['IDENT'],
		'toString': 'left',
		'unparsed': [],
		'warnings': []
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': []
	},
	'right': {
		'tokens': ['IDENT'],
		'toString': 'right',
		'unparsed': [],
		'warnings': []
	},
	'top': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	},
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
	'10% 2em': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '10%',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'gfddfgs': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'ijai adfasdf ': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'IDENT', 'S'],
		'warnings': []
	}
});
