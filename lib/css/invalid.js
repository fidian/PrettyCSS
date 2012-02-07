var base = require('./base');

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
	return true;
};

exports.parse = function (tokens, parser) {
	var invalid = new Invalid(parser, 'invalid');
	invalid.debug('parse', tokens);
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

	// Match braces and find the right closing block
	var depth = 1;
	invalid.add(token);
	token = tokens.nextToken();

	while (depth) {
		if (token.type == 'BLOCK_OPEN') {
			depth ++;
		} else if (token.type == 'BLOCK_CLOSE') {
			depth --;
		}

		invalid.add(token);
		token = tokens.nextToken();
	}

	tokens.next();
	return invalid;
};
