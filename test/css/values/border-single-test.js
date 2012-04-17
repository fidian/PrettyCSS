"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-single', {
	'5px': {
		'tokens': ['UNIT'],
		'toString': '5px',
		'unparsed': [],
		'warnings': []
	},
	'solid 5px black': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': 'solid 5px black',
		'unparsed': [],
		'warnings': []
	},
	'solid, 5px, black': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'solid',
		'unparsed': ['OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'solid inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'solid inherit',
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
