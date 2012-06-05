"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-play-state-single', {
	'running': {
		'tokens': ['IDENT'],
		'toString': 'running',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'paused inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'paused',
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
