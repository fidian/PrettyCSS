"use strict";
var util = require('./util');

exports.batch = util.makeVows('length-percentage', {
	'1em': {
		'tokens': ['UNIT'],
		'toString': '1em',
		'unparsed': [],
		'warnings': []
	},
	'2px 4px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '2px',
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
