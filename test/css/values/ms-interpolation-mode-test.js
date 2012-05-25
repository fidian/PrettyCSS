"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-interpolation-mode', {
	'nearest-neighbor': {
		'tokens': ['IDENT'],
		'toString': 'nearest-neighbor',
		'unparsed': [],
		'warnings': ['browser-only:ie', 'browser-unsupported:ie9']
	},
	'bicubic inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'bicubic',
		'unparsed': ['IDENT'],
		'warnings': ['browser-only:ie', 'browser-unsupported:ie9']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
