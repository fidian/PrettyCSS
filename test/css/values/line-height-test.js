"use strict";
var util = require('./util');

exports.batch = util.makeVows('line-height', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': []
	},
	'10': {
		'tokens': ['UNIT'],
		'toString': '10',
		'unparsed': [],
		'warnings': []
	},
	'50em': {
		'tokens': ['UNIT'],
		'toString': '50em',
		'unparsed': [],
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
