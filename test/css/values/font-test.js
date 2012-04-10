"use strict";
var util = require('./util');

exports.batch = util.makeVows('font', {
	'normal small-caps 300 12px/12px italic serif': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'UNIT', 'S', 'UNIT', 'OPERATOR', 'UNIT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'normal small-caps 300 12px / 12px italic serif',
		'unparsed': [],
		'warnings': []
	},
	'normal small-caps 300 12px/12px italic serif ADKFHASDFHA': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'UNIT', 'S', 'UNIT', 'OPERATOR', 'UNIT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'normal small-caps 300 12px / 12px italic serif ADKFHASDFHA',
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
