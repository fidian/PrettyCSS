var base = require('./base');
var block = require('./block');
var stylesheet = require('./stylesheet');
var tokenizer = require('../tokenizer');

var At = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "at",
	toString: function () {
		this.debug('toString', this.list);
		var simpleSelectors = [];
		var building = "";

		var done = function () {
			if (building != "") {
				simpleSelectors.push(building);
				building = "";
			}
		};

		this.list.forEach(function (token) {
			switch (token.type) {
				case "S":
					done();
					break;

				case "COMBINATOR":
					done();
					building += token.content;
					done();
					break;

				default:
					building += token.content;
			}
		});

		done();
		out = simpleSelectors.join(this.parser.options.selector_whitespace);
		return this.addPreAndPost('selector', out);
	}
});

exports.canStartWith = function (token) {
	return token.type == 'AT_SYMBOL';
};

exports.parse = function (tokens, parser) {
	var at = new At(parser);
	at.debug('parse', tokens);
	at.block = null;
	var token = tokens.getToken();

	// Eat until the first semicolon or the ending of a block
	while (token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		at.add(token);
		token = tokens.nextToken();
	}

	if (token.type == 'SEMICOLON') {
		at.add(token);
		tokens.next();
		return at;
	}

	// Match braces and find the right closing block
	at.block = block.parse(tokens, parser);

	// Send the block through the stylesheet parser
	var blockTokens = tokenizer.tokenize('', parser.options);
	blockTokens.tokens = at.block.list;
	at.stylesheet = stylesheet.parse(blockTokens, parser);

	return at;
};
