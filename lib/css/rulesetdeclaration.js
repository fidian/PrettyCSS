"use strict";

var base = require('./base');
var util = require('../util');

var RulesetDeclaration = base.baseConstructor();

util.extend(RulesetDeclaration.prototype, base.base, {
	name: "rulesetdeclaration",

	parseTokenList: [
		'comment',
		'whitespace',
		'declaration',
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
	var rd = new RulesetDeclaration(bucket, container);
	rd.debug('parse', tokens);

	while (tokens.anyLeft()) {
		rd.parseTokens(tokens);
	}

	return rd;
};
