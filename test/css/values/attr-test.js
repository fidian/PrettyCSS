"use strict";
var util = require('./util');

exports.batch = util.makeVows('attr', {
	'attr(': {
		'tokens': [ 'FUNCTION' ],
		'toString': null,
		'unparsed': [ 'FUNCTION' ],
		'warnings': null
	},
	'attr(monkey': {
		'tokens': [ 'FUNCTION', 'IDENT' ],
		'toString': null,
		'unparsed': [ 'FUNCTION', 'IDENT' ],
		'warnings': null
	},
	'attr(monkey)': {
		'tokens': [ 'FUNCTION', 'IDENT', 'PAREN_CLOSE' ],
		'toString': 'attr(monkey)',
		'unparsed': [],
		'warnings': []
	},
	'attr( monkey ) banana': {
		'tokens': [ 'FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT' ],
		'toString': 'attr(monkey)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'attr("monkey")': {
		'tokens': [ 'FUNCTION', 'STRING', 'PAREN_CLOSE' ],
		'toString': null,
		'unparsed': [ 'FUNCTION', 'STRING', 'PAREN_CLOSE' ],
		'warnings': []
	},

	// Invalid
	'-12': {
		'tokens': [ 'UNIT' ],
		'toString': null,
		'unparsed': [ 'UNIT' ],
		'warnings': []
	}
});
