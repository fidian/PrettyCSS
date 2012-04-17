"use strict";
var util = require('./util');

exports.batch = util.makeVows('template', {
	'"any valid string"': {
		'tokens': ['STRING'],
		'toString': '"any valid string"',
		'unparsed': [],
		'warnings': ['css-draft']
	},
	'"asdf"/1.5px "asd " / 2em': {
		'tokens': ['STRING', 'OPERATOR', 'UNIT', 'S', 'STRING', 'S', 'OPERATOR', 'S', 'UNIT'],
		'toString': '"asdf"/1.5px "asd "/2em',
		'unparsed': [],
		'warnings': ['css-draft']
	},
	'"aa bb cc"/100px 3em 3em grover': {
		'tokens': ['STRING', 'OPERATOR', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '"aa bb cc"/100px 3em 3em',
		'unparsed': ['IDENT'],
		'warnings': ['css-draft']
	},
	'"valid" inherit': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"valid" inherit',
		'unparsed': [],
		'warnings': ['css-draft', 'inherit-not-allowed']
	},
	// inherit isn't a valid template
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
