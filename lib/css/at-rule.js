var base = require('./base');
var block = require('./block');
var stylesheet = require('./stylesheet');
var tokenizer = require('../tokenizer');
var util = require('../util');

var At = base.baseConstructor();

util.extend(At.prototype, base.base, {
	name: "at-rule",

	toString: function () {
		this.debug('toString', this.list);
		var ws = this.parser.options.at_whitespace;
		var out = ""

		this.list.forEach(function (value) {
			if (value.type == "S") {
				out += ws;
			} else {
				out += value.content;
			}
		})

		if (this.stylesheet) {
			var block = this.stylesheet.toString();
			block = this.reindent(block);
			out += this.addWhitespace('atblock', block);
		}

		return this.addWhitespace('at', out);
	}
});

exports.canStartWith = function (token, tokens, container) {
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
	var depth = 1;
	token = tokens.nextToken();  // Consume BLOCK_OPEN
	var blockTokens = [];

	while (token && depth) {
		if (token.type == 'BLOCK_OPEN') {
			depth ++;
		} else if (token.type == "BLOCK_CLOSE") {
			depth --;
		}

		if (depth) {
			blockTokens.push(token);
		}

		token = tokens.nextToken();
	}
		
	// Send the block through the stylesheet parser
	var tempTokenizer = tokenizer.tokenize('', parser.options);
	tempTokenizer.tokens = blockTokens;
	at.stylesheet = stylesheet.parse(tempTokenizer, parser, at);

	return at;
};
