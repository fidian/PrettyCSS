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

	reparseAs: function (anotherThing) {
		this.debug('reparse as ' + anotherThing, this.list);
		var tempTokenizer = this.bucket.tokenizer.tokenize('', this.bucket.options);
		tempTokenizer.tokens = this.list;
		this.list = [
			this.bucket[anotherThing].parse(tempTokenizer, this.bucket, this)
		];
		this.debug('reparse finish', this.list);
	},

	toString: function () {
		this.debug('toString', this.list);
		var out = this.makeString(this.list);
		out = this.reindent(out);
		out = this.addWhitespace('block', out);
		return out;
	},

	toStringChangeCase: function () {
		// Do not change case if we didn't parse the data
		return this.toString();
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'BLOCK_OPEN';
};

exports.parse = function (tokens, bucket, container) {
	var block = new Block(bucket, container);
	var depth = 1;
	block.debug('parse', tokens);

	// Consume open brace
	tokens.next();

	while (tokens.anyLeft()) {
		var token = tokens.getToken();

		if (token.type == 'BLOCK_CLOSE') {
			depth --;

			if (! depth) {
				// Done with this block
				tokens.next();
				return block;
			}
		} else if (token.type == 'BLOCK_OPEN') {
			depth ++;
		}

		block.add(token);
		tokens.next();
	}

	return block;
};
