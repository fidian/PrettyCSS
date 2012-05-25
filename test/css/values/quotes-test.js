"use strict";
var util = require('./util');

exports.batch = util.makeVows('quotes', {
	'"one" "two"': {
		'tokens': ['STRING', 'S', 'STRING'],
		'toString': '"one" "two"',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'"one" "two" \'three\' \'four\' none': {
		'tokens': ['STRING', 'S', 'STRING', 'S', 'STRING', 'S', 'STRING', 'S', 'IDENT'],
		'toString': '"one" "two" \'three\' \'four\'',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'InvalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
