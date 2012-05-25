"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-progress-appearance', {
	'bar': {
		'tokens': ['IDENT'],
		'toString': 'bar',
		'unparsed': [],
		'warnings': ['browser-only:ie8']
	},
	'ring inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'ring',
		'unparsed': ['IDENT'],
		'warnings': ['browser-only:ie8']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
