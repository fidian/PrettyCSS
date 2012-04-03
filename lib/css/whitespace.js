"use strict";

var base = require('./base');
var util = require('../util');

var Whitespace = base.baseConstructor();

util.extend(Whitespace.prototype, base.base, {
	name: "whitespace",

	toString: function () {
		this.debug('toString', this.list);
		return "";
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'S';
};

exports.parse = function (tokens, bucket, container) {
	var whitespace = new Whitespace(bucket, container);
	whitespace.debug('parse', tokens);
	whitespace.add(tokens.getToken());
	tokens.next();
	return whitespace;
};
