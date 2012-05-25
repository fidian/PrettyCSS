"use strict";
var util = require('./util');

exports.batch = util.makeVows('length-percentage2', {
	'1em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'2px 4px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '2px 4px',
		'unparsed': [],
		'warnings': []
	},
	'2px 4% 6em': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '2px 4%',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
