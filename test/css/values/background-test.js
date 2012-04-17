"use strict";
var util = require('./util');

exports.batch = util.makeVows('background', {
	// Test bg-layer value 
	'#fff': {
		'tokens': ['HASH'],
		'toString': '#fff',
		'unparsed': [],
		'warnings': []
	},
	// The bg-layer that specifies a background color must be the last one,
	// thus the first three layers here cause problems
	'#fff, #000, #f00, blue': {
		'tokens': ['HASH', 'OPERATOR', 'S', 'HASH', 'OPERATOR', 'S', 'HASH', 'OPERATOR', 'S', 'IDENT'],
		'toString': '#fff, #000, #f00, blue',
		'unparsed': [],
		'warnings': ['illegal', 'illegal', 'illegal']
	},
	'url(a)': {
		'tokens': ['URL'],
		'toString': 'url(a)',
		'unparsed': [],
		'warnings': []
	},
	'url(a) alsjdjd': {
		'tokens': ['URL','S', 'IDENT'],
		'toString': 'url(a)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'ahaskdfhsdf ':{
		'tokens': ['IDENT', 'S'],
		'toString': null,
		'unparsed': ['IDENT','S'],
		'warnings': []
	}
	
});
