"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-align', {
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': []
	},
	'start': {
		'tokens': ['IDENT'],
		'toString': 'start',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
