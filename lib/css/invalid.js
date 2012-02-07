var base = require('./base');
var block = require('./block');

var Invalid = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "invalid",
	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function () {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, parser) {
	var invalid = new Invalid(parser);
	invalid.debug('parse', tokens);
	invalid.block = null;
	invalid.add(tokens.getToken());

	var token = tokens.nextToken();

	// Eat until the first semicolon or the ending of a block
	while (token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		invalid.add(token);
		token = tokens.nextToken();
	}

	if (token.type == 'SEMICOLON') {
		invalid.add(token);
		tokens.next();
		return invalid;
	}

	invalid.block = block.parse(tokens, parser);
	return invalid;
};
