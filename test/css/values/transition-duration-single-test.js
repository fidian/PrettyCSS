"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-duration-single', {
	'1.0s': {
		'tokens': ['UNIT'],
		'toString': '1.0s',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1s 2s': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1s',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
