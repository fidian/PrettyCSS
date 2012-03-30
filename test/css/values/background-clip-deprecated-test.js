"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-clip-deprecated', {
	'inherit ': {
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': [ 'deprecated_css_use_background-clip' ]
	},
	'inherit 77': {
		'tokens': [ 'IDENT', 'S', 'UNIT' ],
		'toString': 'inherit',
		'unparsed': [ 'UNIT' ],
		'warnings': [ 'deprecated_css_use_background-clip' ]
	},
	'moose': {
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	}
});
