"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-clip', {
	'inherit ': {
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'content-box 77': {
		'tokens': [ 'IDENT', 'S', 'UNIT' ],
		'toString': 'content-box',
		'unparsed': [ 'UNIT' ],
		'warnings': ['browser-unsupported:ie7', 'browser-unsupported:ie8']
	},
	'moose': {
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	}
});
