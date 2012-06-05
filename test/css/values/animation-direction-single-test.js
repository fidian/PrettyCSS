"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-direction-single', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'reverse normal': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'reverse',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
