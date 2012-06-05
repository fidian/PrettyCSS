"use strict";

var base = require('./base');
var declarationBucket = require('./declarationbucket');
var util = require('../util');

var Page = base.baseConstructor();

util.extend(Page.prototype, base.base, {
	name: "page",

	parseTokenList: [
		'comment',
		'whitespace',
		declarationBucket['page'],
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
	var p = new Page(bucket, container);
	p.debug('parse', tokens);

	if (! bucket.parser.options.cssLevel || bucket.parser.options.cssLevel < 2) {
		bucket.parser.addWarning('css-minimum:2', tokens.getToken());
	}

	while (tokens.anyLeft()) {
		p.parseTokens(tokens);
	}

	return p;
};
