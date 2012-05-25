"use strict";
var util = require('./util');

exports.batch = util.makeVows('letter-spacing', {
	'12%': {
		'tokens': ['UNIT'],
		'toString': '12%',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12em': {
		'tokens': ['UNIT'],
		'toString': '12em',
		'unparsed': [],
		'warnings': []
	},
	'11px 12px 13px': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '11px 12px 13px',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'11px 12px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '11px 12px',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'normal inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'normal',
		'unparsed': ['IDENT'],
		'warnings': []
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
