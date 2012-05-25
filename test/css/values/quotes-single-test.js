"use strict";
var util = require('./util');

exports.batch = util.makeVows('quotes-single', {
	'"one" "two"': {
		'tokens': ['STRING', 'S', 'STRING'],
		'toString': '"one" "two"',
		'unparsed': [],
		'warnings': []
	},
	'\'one\' \'two\' \'three\'': {
		'tokens': ['STRING', 'S', 'STRING', 'S', 'STRING'],
		'toString': '\'one\' \'two\'',
		'unparsed': ['STRING'],
		'warnings': []
	},
	'"one" two': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['STRING', 'S', 'IDENT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
