"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-east-asian-variant-values', {
	'jis78': {
		'tokens': ['IDENT'],
		'toString': 'jis78',
		'unparsed': [],
		'warnings': []
	},
	'simplified inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'simplified',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
