var atRule = require('./at-rule');
var base = require('./base');
var comment = require('./comment');
var invalid = require('./invalid');
var declaration = require('./declaration');
var util = require('../util');
var whitespace = require('./whitespace');

// Do not use base.baseConstructor() since container is optional here
var Block = function (parser, container) {
	this.init();
	this.setParser(parser);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Block.prototype, base.base, {
	name: "block",

	parseTokenList: [
		atRule,
		exports,  // self-reference
		comment,
		whitespace,
		declaration,
		invalid // Must be last
	],

	toString: function () {
		this.debug('toString', this.list);
		var out = this.makeString(this.list);
		out = this.reindent(out);
		var out = this.addWhitespace('block', out);
		return out;
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'BLOCK_OPEN';
};

exports.parse = function (tokens, parser, container) {
	var block = new Block(parser, container);
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
