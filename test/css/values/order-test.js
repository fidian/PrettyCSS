"use strict";
var util = require('./util');

exports.batch = util.makeVows('order', {
	'1': {
		'tokens': ['UNIT'],
		'toString': '1',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'4': {
		'tokens': ['UNIT'],
		'toString': '4',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'4.2': {
		'tokens': ['UNIT'],
		'toString': '4.2',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10', 'require-integer']
	},
	'1px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'-1': {
		'tokens': ['UNIT'],
		'toString': '-1',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10', 'require-positive-value']
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
