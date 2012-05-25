"use strict";
var util = require('./util');

exports.batch = util.makeVows('shape', {
	'rect(auto, auto, auto, auto)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'rect(auto, auto, auto, auto)',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
