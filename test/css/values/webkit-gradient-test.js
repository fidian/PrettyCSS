"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-gradient', {
	'-webkit-gradient(linear, left, right top, from(blue), to(red))': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE', 'OPERATOR', 'S', 'FUNCTION', 'IDENT', 'PAREN_CLOSE', 'PAREN_CLOSE'],
		'toString': '-webkit-gradient(linear, left, right top, from(blue), to(red))',
		'unparsed': [],
		'warnings': []
	},
	'-webkit-gradient(radial, 40% 40%, 1em, center, 20px, color-stop(30%, #FFFF88), color-stop(0.4, green))': {
		'tokens': [
			'IDENT', 'CHAR',
			'IDENT', 'OPERATOR',
			'S', 'UNIT', 'S', 'UNIT', 'OPERATOR',
			'S', 'UNIT', 'OPERATOR',
			'S', 'IDENT', 'OPERATOR',
			'S', 'UNIT', 'OPERATOR',
			'S', 'FUNCTION', 'UNIT', 'OPERATOR', 'S', 'HASH', 'PAREN_CLOSE', 'OPERATOR',
			'S', 'FUNCTION', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE',
			'PAREN_CLOSE'],
		'toString': '-webkit-gradient(radial, 40% 40%, 1em, center, 20px, color-stop(30%, #ffff88), color-stop(0.4, green))',
		'unparsed': [],
		'warnings': []
	},
	'-webkit-gradient(linear, left, top right, blue, red)': {
		'tokens': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['IDENT', 'CHAR', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT', 'PAREN_CLOSE'],
		'warnings': null
	},
	// inherit is invalid
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
