"use strict";

var base = require('./base');
var util = require('../util');

var CDC = base.baseConstructor();

util.extend(CDC.prototype, base.base, {
	name: 'cdc',

	toString: function () {
		this.debug('toString', this.list);
		return this.bucket.options.cdc;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'CDC';
};

exports.parse = function (tokens, bucket, container) {
	var cdc = new CDC(bucket, container);
	cdc.debug('parse', tokens);
	cdc.add(tokens.getToken());
	tokens.next();
	return cdc;
};
