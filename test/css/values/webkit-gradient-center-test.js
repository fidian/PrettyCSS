"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-gradient-center', {
	'1em 1em': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1em 1em',
		'unparsed': [],
		'warnings': []
	},
	'1em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'1em yellow': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'IDENT'],
		'warnings': null
	},
	'left top 1em': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'UNIT'],
		'toString': 'left top',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
