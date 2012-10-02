"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-text-stroke-color', {
	'yellow': {
		'tokens': ['IDENT'],
		'toString': 'yellow',
		'unparsed': [],
		'warnings': ['browser-only:s']
	},
	'currentColor': {
		'tokens': ['IDENT'],
		'toString': 'currentcolor',
		'unparsed': [],
		'warnings': ['browser-only:s']
	},
	'monkey': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'inherit monkey': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['browser-only:s']
	}
});
