"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-image', {
	// Test bg-layer value 
	'none url(a)': {
		'tokens': ['IDENT', 'S', 'URL'],
		'toString': 'none',
		'unparsed': ['URL'],
		'warnings': []
	},
	'url(google), url(yahoo)': {
		'tokens': ['URL', 'OPERATOR', 'S', 'URL'],
		'toString': 'url(google), url(yahoo)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'url(a) cookie monster': {
		'tokens': ['URL', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'url(a)',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'alsjdjd': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
