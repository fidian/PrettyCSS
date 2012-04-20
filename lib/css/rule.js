"use strict";

var base = require('./base');
var declarationBucket = require('./declarationbucket');
var util = require('../util');

var Rule = base.baseConstructor();

util.extend(Rule.prototype, base.base, {
	name: "rule",

	parseTokenList: [
		'comment',
		'whitespace',
		declarationBucket.rule,
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
	var rd = new Rule(bucket, container);
	rd.debug('parse', tokens);

	while (tokens.anyLeft()) {
		rd.parseTokens(tokens);
	}

	return rd;
};
