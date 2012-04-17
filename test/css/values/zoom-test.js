"use strict";
var util = require('./util');

exports.batch = util.makeVows('zoom', {
	'1.0': {
		'tokens': ['UNIT'],
		'toString': '1.0',
		'unparsed': [],
		'warnings': []
	},
	'120% inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '120%',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
