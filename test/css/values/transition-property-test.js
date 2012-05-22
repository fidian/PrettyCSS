"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-property', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	// Inherit is gobbled up here, but is caught at a higher level
	'blah, blah2, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'blah, blah2, inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'7deg': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
