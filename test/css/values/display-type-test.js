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
		'warnings': [ 'minimum_css_version_2', 'maximum_css_version_2', 'not_forward_compatible_2.1' ]
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
		'warnings': ['minimum_css_version_2']
	},
	'inline-block': {
		'tokens': ['IDENT'],
		'toString': 'inline-block',
		'unparsed': [],
		'warnings': ['minimum_css_version_2.1']
	},
	'inherit pinkeye 27': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'UNIT' ],
		'toString': 'inherit',
		'unparsed': [ 'IDENT', 'S', 'UNIT' ],
		'warnings': ['minimum_css_version_2', 'browser_unsupported_IE7', 'browser_quirk_IE8']
	}
});
