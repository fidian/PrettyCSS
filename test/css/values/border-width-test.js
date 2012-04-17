"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-width', {
	'5px': {
		'tokens': ['UNIT'],
		'toString': '5px',
		'unparsed': [],
		'warnings': []
	},
	'1px 2px 3px 4px 5px': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1px 2px 3px 4px',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'5px inherit 10em': {
		'tokens': ['UNIT', 'S', 'IDENT', 'S', 'UNIT'],
		'toString': '5px inherit 10em',
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
