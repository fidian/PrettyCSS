"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-size', {
	'auto 26%': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'auto 26%',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'50em': {
		'tokens': ['UNIT'],
		'toString': '50em',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'cover': {
		'tokens': ['IDENT'],
		'toString': 'cover',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
