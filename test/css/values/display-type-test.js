"use strict";
var util = require('./util');

exports.batch = util.makeVows('display-type', {
	'block': {
		'tokens': [ 'IDENT' ],
		'toString': 'block',
		'unparsed': [],
		'warnings': []
	},
	'compact ': {
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'compact',
		'unparsed': [],
		'warnings': [ 'css-minimum:2', 'css-maximum:2', 'not-forward-compatible:2.1' ]
	},
	'asdfjadfj': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'table-footer-group': {
		'tokens': ['IDENT'],
		'toString': 'table-footer-group',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'inline-block': {
		'tokens': ['IDENT'],
		'toString': 'inline-block',
		'unparsed': [],
		'warnings': ['css-minimum:2.1']
	},
	'flex': {
		'tokens': ['IDENT'],
		'toString': 'flex',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit pinkeye 27': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'UNIT' ],
		'toString': 'inherit',
		'unparsed': [ 'IDENT', 'S', 'UNIT' ],
		'warnings': ['css-minimum:2', 'browser-unsupported:ie7', 'browser-quirk:ie8']
	}
});
