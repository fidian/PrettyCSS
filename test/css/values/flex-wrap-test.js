"use strict";
var util = require('./util');

exports.batch = util.makeVows('flex-wrap', {
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
	'wrap-reverse': {
		'tokens': ['IDENT'],
		'toString': 'wrap-reverse',
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
