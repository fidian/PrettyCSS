"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-stretch-single', {
	'expanded': {
		'tokens': ['IDENT'],
		'toString': 'expanded',
		'unparsed': [],
		'warnings': []
	},
	'expanded inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'expanded',
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
