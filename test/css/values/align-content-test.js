"use strict";
var util = require('./util');

exports.batch = util.makeVows('align-content', {
	'flex-start': {
		'tokens': ['IDENT'],
		'toString': 'flex-start',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'flex-end': {
		'tokens': ['IDENT'],
		'toString': 'flex-end',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'space-between': {
		'tokens': ['IDENT'],
		'toString': 'space-between',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'space-around': {
		'tokens': ['IDENT'],
		'toString': 'space-around',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'stretch': {
		'tokens': ['IDENT'],
		'toString': 'stretch',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'left': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'browser-unsupported:ie10']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});




