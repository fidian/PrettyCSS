"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-repeat', {
	'repeat': {
		'tokens': ['IDENT'],
		'toString': 'repeat',
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
