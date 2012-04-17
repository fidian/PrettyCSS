"use strict";

var base = require('./base');
var util = require('../util');

var Invalid = base.baseConstructor();

util.extend(Invalid.prototype, base.base, {
	name: "invalid",

	consume: function (tokens) {
		var token = tokens.getToken();

		// Eat until the first semicolon or the ending of a block
		while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
			this.add(token);
			token = tokens.nextToken();
		}

		if (! token) {
			return;
		}

		if (token.type == 'SEMICOLON') {
			this.add(token);
			tokens.next();
			return;
		}

		this.add(this.bucket.block.parse(tokens, this.bucket, this));
	},

	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, bucket, container) {
	var invalid = new Invalid(bucket, container);
	invalid.debug('parse', tokens);
	invalid.block = null;

	if (tokens) {
		bucket.parser.addError('invalid-token', tokens.getToken());
		invalid.consume(tokens);
	}

	return invalid;
};
