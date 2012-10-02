"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-text-stroke-width', {
	'1px': {
		'tokens': ['UNIT'],
		'toString': '1px',
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
