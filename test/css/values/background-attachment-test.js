"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-attachment', {
	// <bg-attachment>#
	'scroll ': {
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'scroll',
		'unparsed': [],
		'warnings': []
	},
	'scroll , fixed , keyboard': {
		'tokens': [ 'IDENT', 'S', 'OPERATOR', 'S', 'IDENT', 'S', 'OPERATOR', 'S', 'IDENT' ],
		'toString': 'scroll, fixed',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': [ 'css-minimum:3' ]
	},
	'scroll,fixed,scroll,fixed': {
		'tokens': [ 'IDENT', 'OPERATOR', 'IDENT', 'OPERATOR', 'IDENT', 'OPERATOR', 'IDENT' ],
		'toString': 'scroll, fixed, scroll, fixed',
		'unparsed': [],
		'warnings': [ 'css-minimum:3' ]
	},
	'moose': {
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	}
});
