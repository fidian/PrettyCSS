"use strict";

var base = require('./base');
var util = require('../util');

// Do not use base.baseConstructor() since container is optional here
var Keyframes = base.baseConstructor();

util.extend(Keyframes.prototype, base.base, {
	name: "keyframes",

	parseTokenList: [
		'comment',
		'keyframe',
		'whitespace',
		'invalid' // Must be last
	],

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.makeString(this.list);
		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Not used in automatic pattern matching
};

exports.parse = function (tokens, bucket, container) {
	var styles = new Keyframes(bucket, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		styles.parseTokens(tokens);
	}

	return styles;
};
