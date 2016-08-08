"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex-resize-pair', {
	'1': {
		'tokens': ['UNIT'],
		'toString': '1',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'0.4': {
		'tokens': ['UNIT'],
		'toString': '0.4',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1 0': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1 0',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1 0 1': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1 0',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'1 auto': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '1',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'1px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});


