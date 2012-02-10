var base = require('./base');
var block = require('./block');
var util = require('../util');

var Invalid = base.baseConstructor();

util.extend(Invalid.prototype, base.base, {
	name: "invalid",

	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function (token, tokens, container) {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, parser, container) {
	var invalid = new Invalid(parser, container);
	invalid.debug('parse', tokens);
	invalid.block = null;
	invalid.add(tokens.getToken());

	var token = tokens.nextToken();

	// Eat until the first semicolon or the ending of a block
	while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		invalid.add(token);
		token = tokens.nextToken();
	}

	if (! token) {
		return invalid;
	}

	if (token.type == 'SEMICOLON') {
		invalid.add(token);
		tokens.next();
		return invalid;
	}

	invalid.block = block.parse(tokens, parser, container);
	return invalid;
};
