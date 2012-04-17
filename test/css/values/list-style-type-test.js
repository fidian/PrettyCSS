"use strict";
var util = require('./util');

exports.batch = util.makeVows('list-style-type', {
	'disc': {
		'tokens': ['IDENT'],
		'toString': 'disc',
		'unparsed': [],
		'warnings': []
	},
	'lower-latin': {
		'tokens': ['IDENT'],
		'toString': 'lower-latin',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2.1']
	},
	'arabic-indic': {
		'tokens': ['IDENT'],
		'toString': 'arabic-indic',
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
