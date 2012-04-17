"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-css2', {
	'underline': {
		'tokens': ['IDENT'],
		'toString': 'underline',
		'unparsed': [],
		'warnings': []
	},
	'overline': {
		'tokens': ['IDENT'],
		'toString': 'overline',
		'unparsed': [],
		'warnings': []
	},
	'line-through': {
		'tokens': ['IDENT'],
		'toString': 'line-through',
		'unparsed': [],
		'warnings': []
	},
	'blink asdfasdfasdfsdf': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'blink',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'browser-unsupported:ie7', 'browser-quirk:ie8']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
