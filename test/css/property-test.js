"use strict";
var util = require('./util');

exports.batch = util.makeVows('property', {
	'property': {
		'input': 'property-name:"some-value"\n',
		"errors": [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "property-name"
	},
	'eof': {
		'input': 'property-name\n',
		"errors": [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "property-name"
	},
	'whitespace': {
		'input': 'property-name\n:"someValue"\n',
		"errors": [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "property-name"
	}
});
