"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1': {
		'tokens': ['UNIT'],
		'toString': '1',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'10em': {
		'tokens': ['UNIT'],
		'toString': '10em',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'30px': {
		'tokens': ['UNIT'],
		'toString': '30px',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1 30px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1 30px',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1 0': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1 0',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1 0 auto': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '1 0 auto',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'auto 1 0': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'auto 1 0',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'1 0 50px': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1 0 50px',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
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
	},
	'1 0 50px 30%': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '1 0 50px',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	}
});

