"use strict";
// TODO:  "from" can switch to "0%"
// TODO:  "100%" can switch to "to"

var base = require('./base');
var util = require('../util');

var Keyframe = base.baseConstructor();

util.extend(Keyframe.prototype, base.base, {
	name: "keyframe",
	
	toString: function () {
		this.debug('toString');
		var decAsStrings = [];

		var out = this.selector.toString();
		out = this.addWhitespace('keyframeselector', out);
		out += this.bucket.options.selector_whitespace;

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('keyframe', out);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	if (token.content.match(/^(to|from|([0-9]+(\.[0-9]*)?|[0-9]*\.?[0-9]+)%)$/i)) {
		return true;
	}

	return false;
};

exports.parse = function (tokens, bucket, container) {
	var keyframe = new Keyframe(bucket, container);
	keyframe.debug('parse', tokens);

	// The current token is our keyframe selector
	keyframe.selector = (tokens.getToken());
	var token = tokens.nextToken();

	if (token && token.type == 'S') {
		token = tokens.nextToken();
	}

	if (! token || token.type != 'BLOCK_OPEN') {
		bucket.parser.addError('block-expected', token);

		var invalid = bucket.invalid.parse(null, bucket, container);
		invalid.add(keyframe.selector);

		if (token) {
			invalid.consume(tokens);
		}

		return invalid;
	}

	keyframe.block = bucket.block.parse(tokens, bucket, keyframe);
	keyframe.block.reparseAs('rule');
	return keyframe;
};
