"use strict";
var util = require('./util');

exports.batch = util.makeVows('resize', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'both vertical': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'both',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
