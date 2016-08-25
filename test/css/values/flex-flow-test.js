"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex-flow', {
	'row': {
		'tokens': ['IDENT'],
		'toString': 'row',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'column': {
		'tokens': ['IDENT'],
		'toString': 'column',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'nowrap': {
		'tokens': ['IDENT'],
		'toString': 'nowrap',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'wrap': {
		'tokens': ['IDENT'],
		'toString': 'wrap',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'row wrap': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'row wrap',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'nowrap column': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'nowrap column',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'row nowrap column': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'row nowrap',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});

