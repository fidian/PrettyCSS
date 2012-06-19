"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-src-single', {
	'url(asdf.ttf)': {
		'tokens': ['URL'],
		'toString': 'url(asdf.ttf)',
		'unparsed': [],
		'warnings': []
	},
	'url(asdf.ttf) ttf': {
		'tokens': ['URL', 'S', 'IDENT'],
		'toString': 'url(asdf.ttf)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'url(asdf.ttf) format("ttf")': {
		'tokens': ['URL', 'S', 'FUNCTION', 'STRING', 'PAREN_CLOSE'],
		'toString': 'url(asdf.ttf) format("ttf")',
		'unparsed': [],
		'warnings': []
	},
	'local(monospace) inherit': {
		'tokens': ['FUNCTION', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'local(monospace)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'url(../fonts/proximanova-semiboldit-webfont.woff) format(woff)': {
		'tokens': ['URL', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'url(../fonts/proximanova-semiboldit-webfont.woff) format("woff")',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
