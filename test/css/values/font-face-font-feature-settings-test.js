"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-feature-settings', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'"1"': {
		'tokens': ['STRING'],
		'toString': '"1"',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'"1", "2" "3"': {
		'tokens': ['STRING', 'OPERATOR', 'S', 'STRING', 'S', 'STRING'],
		'toString': '"1", "2"',
		'unparsed': ['STRING'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
