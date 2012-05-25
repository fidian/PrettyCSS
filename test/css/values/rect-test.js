"use strict";
var util = require('./util');

exports.batch = util.makeVows('rect', {
	'rect(auto, auto, auto, auto)': {
		'tokens': ['FUNCTION', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'rect(auto, auto, auto, auto)',
		'unparsed': [],
		'warnings': []
	},
	'rect(1em, 12px, 7pt, auto)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'rect(1em, 12px, 7pt, auto)',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
