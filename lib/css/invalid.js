var base = require('./base');
var block = require('./block');
var util = require('../util');

var Invalid = base.baseConstructor();

util.extend(Invalid.prototype, base.base, {
	name: "invalid",

	consume: function (tokens, parser, container) {
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

		this.block = block.parse(tokens, this.parser, this);
	},

	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function (token, tokens) {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, parser, container) {
	var invalid = new Invalid(parser, container);
	invalid.debug('parse', tokens);
	invalid.block = null;

	if (tokens) {
		invalid.consume(tokens);
	}

	return invalid;
};
