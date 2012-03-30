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
		'warnings': ['minimum_css_version_2', 'browser_unsupported_IE7', 'browser_quirk_IE8']
	},
	'initial': {
		'tokens': ['IDENT'],		
		'toString': 'initial',  	
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},		          	
	'klasdfkljsd': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	}
});
