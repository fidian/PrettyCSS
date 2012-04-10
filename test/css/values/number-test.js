"use strict";
var util = require('./util');

exports.batch = util.makeVows('number', {
	'7': {
		'tokens': ['UNIT'],
		'toString': '7',
		'unparsed': [],
		'warnings': []
	},
	'8px 12': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'UNIT'],
		'warnings': []
	},
	'+100': {
		'tokens': ['UNIT'],
		'toString': '+100',
		'unparsed': [],
		'warnings': []
	},
	'-1.007': {
		'tokens': ['UNIT'],
		'toString': '-1.007',
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
