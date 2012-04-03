"use strict";

var base = require('./base');
var util = require('../util');

// Do not use base.baseConstructor() since container is optional here
var Stylesheet = function (bucket, container) {
	this.init();
	this.setBucket(bucket);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Stylesheet.prototype, base.base, {
	name: "stylesheet",

	parseTokenList: [
		'atRule',
		'cdc',
		'cdo',
		'comment',
		'ruleset',
		'whitespace',
		'invalid' // Must be last
	],

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.makeString(this.list);
		out = out.replace(/^[ \n\r\t\f]*|[ \n\r\t\f]*$/g, '');
		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Not used in automatic pattern matching
};

exports.parse = function (tokens, bucket, container) {
	var styles = new Stylesheet(bucket, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		styles.parseTokens(tokens);
	}

	return styles;
};
