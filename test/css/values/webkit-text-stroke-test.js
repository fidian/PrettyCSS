"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-text-stroke', {
	'1px yellow shallow': {
		'tokens': ['UNIT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': '1px yellow',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'yellow 1px': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'UNIT'],
		'warnings': null
	},
	'1px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'yellow': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'inherit monkey': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	}
});
