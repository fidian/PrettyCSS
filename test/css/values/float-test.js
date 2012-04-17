"use strict";
var util = require('./util');

exports.batch = util.makeVows('float', {
	'left': {
		'tokens': ['IDENT'],
		'toString': 'left',
		'unparsed': [],
		'warnings': []
	},
	'outside': {
		'tokens': ['IDENT'],
		'toString': 'outside',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'browser-quirk:ie8', 'browser-unsupported:ie7']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
