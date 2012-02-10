var base = require('./base');
var block = require('./block');
var stylesheet = require('./stylesheet');
var tokenizer = require('../tokenizer');
var util = require('../util');

var At = base.baseConstructor();

util.extend(At.prototype, base.base, {
	name: "at",

	toString: function () {
		this.debug('toString', this.list);
		var ws = this.parser.options.at_whitespace;
		out = ""

		this.list.forEach(function (value) {
			if (value.type == "S") {
				out += ws;
			} else {
				out += value.content;
			}
		})

		if (this.stylesheet) {
			out += "{";
			out += this.stylesheet.toString();
			out += "}";
		}

		return this.addPreAndPost('at', out);
	}
});

exports.canStartWith = function (token) {
	return token.type == 'AT_SYMBOL';
};

exports.parse = function (tokens, parser, container) {
	var at = new At(parser, container);
	at.debug('parse', tokens);
	at.block = null;
	var token = tokens.getToken();

	// Eat until the first semicolon or the ending of a block
	while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		at.add(token);
		token = tokens.nextToken();
	}

	if (! token) {
		return at;
	}

	if (token.type == 'SEMICOLON') {
		at.add(token);
		tokens.next();
		return at;
	}

	// Match braces and find the right closing block
	at.block = block.parse(tokens, parser, container);

	// Send the block through the stylesheet parser
	var blockTokens = tokenizer.tokenize('', parser.options);
	blockTokens.tokens = at.block.list;
	at.stylesheet = stylesheet.parse(blockTokens, parser, container);

	return at;
};
