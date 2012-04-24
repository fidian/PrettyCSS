"use strict";

var base = require('./base');
var declarationBucket = require('./declarationbucket');
var util = require('../util');

var FontFace = base.baseConstructor();

util.extend(FontFace.prototype, base.base, {
	name: "font-face",

	parseTokenList: [
		'comment',
		'whitespace',
		declarationBucket['font-face'],
		'invalid' // Must be last
	],

	toString: function () {
		this.debug('toString');

		var out = '';

		this.list.forEach(function (item) {
			out += item.toString();
		});

		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Should not be used in auto-detection
};

exports.parse = function (tokens, bucket, container) {
	var ff = new FontFace(bucket, container);
	ff.debug('parse', tokens);

	if (! bucket.parser.options.cssLevel || bucket.parser.options.cssLevel == 2.1) {
		bucket.parser.addWarning('css-unsupported:2.1', tokens.getToken());
	}

	while (tokens.anyLeft()) {
		ff.parseTokens(tokens);
	}

	return ff;
};
