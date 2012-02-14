var base = require('./base');
var block = require('./block');
var declaration = require('./declaration');
var invalid = require('./invalid');
var selector = require('./selector');
var util = require('../util');

var Ruleset = base.baseConstructor();

util.extend(Ruleset.prototype, base.base, {
	name: "ruleset",
	
	toString: function () {
		this.debug('toString');
		var selAsStrings = [];
		var decAsStrings = [];

		this.selectors.forEach(function (sel) {
			selAsStrings.push(sel.toString());
		});

		out = selAsStrings.join(this.parser.options.selector_comma);
		out = this.addWhitespace('selector', out);

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('ruleset', out);
	}
});

exports.canStartWith = selector.canStartWith;

exports.parse = function (tokens, parser, container) {
	var ruleset = new Ruleset(parser, container);
	ruleset.debug('parse', tokens);

	// The current token is the first part of our selector
	ruleset.selectors = [];
	ruleset.block = null;
	ruleset.selectors.push(selector.parse(tokens, parser, container));

	// Add additional selectors
	var nextToken = tokens.getToken();

	while (nextToken.type == 'OPERATOR' && nextToken.content == ',') {
		// Consume comma
		nextToken = tokens.nextToken();

		if (nextToken.type == 'S') {
			nextToken = tokens.nextToken();
		}

		// After commas come another selector
		if (! selector.canStartWith(nextToken)) {
			base.unexpectedToken("expected_selector", nextToken);
		}

		ruleset.selectors.push(selector.parse(tokens, parser, container));

		// Don't advance the token pointer - use getToken here
		nextToken = tokens.getToken();
	}

	if (nextToken.type == "S") {
		nextToken = tokens.nextToken();
	}

	if (nextToken.type != 'BLOCK_OPEN') {
		base.unexpectedToken("expected_block_open", nextToken);
	}

	ruleset.block = block.parse(tokens, parser, container);
	return ruleset;
};
