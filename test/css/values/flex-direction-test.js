"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex-direction', {
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


