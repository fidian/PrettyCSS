"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-format', {
	'format': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'format()': {
		'tokens': ['FUNCTION', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'PAREN_CLOSE'],
		'warnings': null
	},
	'format("string")': {
		'tokens': ['FUNCTION', 'STRING', 'PAREN_CLOSE'],
		'toString': 'format("string")',
		'unparsed': [],
		'warnings': []
	},
	'format("string", "string2")': {
		'tokens': ['FUNCTION', 'STRING', 'OPERATOR', 'S', 'STRING', 'PAREN_CLOSE'],
		'toString': 'format("string", "string2")',
		'unparsed': [],
		'warnings': []
	},
	'format("string", "string2") inherit': {
		'tokens': ['FUNCTION', 'STRING', 'OPERATOR', 'S', 'STRING', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'format("string", "string2")',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'format("no" "comma")': {
		'tokens': ['FUNCTION', 'STRING', 'S', 'STRING', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'STRING', 'S', 'STRING', 'PAREN_CLOSE'],
		'warnings': null
	},
	'format(ident)': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'format("ident")',
		'unparsed': [],
		'warnings': ['autocorrect:"ident"']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
