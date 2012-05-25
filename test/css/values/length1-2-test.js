"use strict";
var util = require('./util');

exports.batch = util.makeVows('length1-2', {
	'1em': {
		'tokens': ['UNIT'],
		'toString': '1em',
		'unparsed': [],
		'warnings': []
	},
	'2px 4px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '2px 4px',
		'unparsed': [],
		'warnings': []
	},
	'2px 4px 6em': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '2px 4px',
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
