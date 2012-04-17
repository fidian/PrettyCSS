"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-color', {
	'#fff': {
		'tokens': ['HASH'],
		'toString': '#fff',
		'unparsed': [],
		'warnings': []
	},
	'#fff ajsdjlksdj': {
		'tokens': ['HASH', 'S', 'IDENT'],
		'toString': '#fff',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],	
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'browser-unsupported:ie7', 'browser-quirk:ie8']
	},
	'initial': {
		'tokens': ['IDENT'],		
		'toString': 'initial',  	
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},		          	
	'klasdfkljsd': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	}
});
