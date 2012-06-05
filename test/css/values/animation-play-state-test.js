"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-play-state', {
	'running': {
		'tokens': ['IDENT'],
		'toString': 'running',
		'unparsed': [],
		'warnings': []
	},
	'running, paused': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'running, paused',
		'unparsed': [],
		'warnings': []
	},
	'paused inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'paused',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
