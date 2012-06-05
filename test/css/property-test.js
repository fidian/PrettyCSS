"use strict";
var util = require('./util');

exports.batch = util.makeVows('property', {
	'property': {
		'input': 'property-name:"some-value"\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "property-name"
	},
	'eof': {
		'input': 'property-name\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "property-name"
	},
	'whitespace': {
		'input': 'property-name\n:"someValue"\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "property-name"
	}
});
