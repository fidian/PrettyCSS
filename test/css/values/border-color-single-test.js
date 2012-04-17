"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-color-single', {
	'#fff': {
		'tokens': ['HASH'],
		'toString': '#fff',
		'unparsed': [],
		'warnings': []
	},
	'blue': {
		'tokens': ['IDENT'],
		'toString': 'blue',		
		'unparsed': [],
		'warnings': []
	},
	'transparent': {
		'tokens': ['IDENT'],
		'toString': 'transparent',
		'unparsed': [],
		'warnings': ['css-minimum:2.1']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
