"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-size-adjust', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': []
	},
	'120% inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '120%',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
