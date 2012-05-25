"use strict";
var util = require('./util');

exports.batch = util.makeVows('integer', {
	'0': {
		'tokens': ['UNIT'],
		'toString': '0',
		'unparsed': [],
		'warnings': []
	},
	'-10': {
		'tokens': ['UNIT'],
		'toString': '-10',
		'unparsed': [],
		'warnings': []
	},
	'+17': {
		'tokens': ['UNIT'],
		'toString': '+17',
		'unparsed': [],
		'warnings': []
	},
	'1em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
