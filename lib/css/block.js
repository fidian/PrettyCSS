"use strict";

var base = require('./base');
var util = require('../util');

// Do not use base.baseConstructor() since container is optional here
var Block = function (bucket, container) {
	this.init();
	this.setBucket(bucket);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Block.prototype, base.base, {
	name: "block",

	parseTokenList: [
		'atRule',
		'block',  // self-reference
		'comment',
		'whitespace',
		'declaration',
		'invalid' // Must be last
	],

	toString: function () {
		this.debug('toString', this.list);
		var out = this.makeString(this.list);
		out = this.reindent(out);
		out = this.addWhitespace('block', out);
		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'BLOCK_OPEN';
};

exports.parse = function (tokens, bucket, container) {
	var block = new Block(bucket, container);
	block.debug('parse', tokens);

	if (container) {
		// Consume open brace
		tokens.next();
	}

	while (tokens.anyLeft()) {
		var token = tokens.getToken();

		if (container && token.type == 'BLOCK_CLOSE') {
			// Done with this block
			tokens.next();
			return block;
		}

		block.parseTokens(tokens);
	}

	return block;
};
