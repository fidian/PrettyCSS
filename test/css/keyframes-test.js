"use strict";
var util = require('./util');

exports.batch = util.makeVows('keyframes', {
	'@keyframes block': {
		'input': 'from {top: 0px}\n\tto {top: 10px}\n',
		'tokenList': ['keyframe', 'whitespace', 'keyframe', 'whitespace'],
		'tokensRemaining': 0,
		'toString': 'from{top:0;}to{top:10px;}'
	},
	'colons produce errors': {
		'input': 'from: {top: 0px}\n\tto: {top: 10px}\n',
		'errors': ['block-expected:COLON@1', 'block-expected:COLON@2'],
		'name': 'keyframes',
		'tokenList': ['invalid', 'whitespace', 'invalid', 'whitespace'],
		'tokensRemaining': 0,
		'toString': ''
	}
});
