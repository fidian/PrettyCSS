var base = require('./base');
var block = require('./block');
var declaration = require('./declaration');
var invalid = require('./invalid');
var ruleComment = require('./rule-comment');
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

		this.declarations.forEach(function (dec) {
			decAsStrings.push(dec.toString());
		});

		out = selAsStrings.join(this.parser.options.selector_comma);
		out = this.addPreAndPost('selector_list', out);
		out += "{";
		out += this.addPreAndPost('declarations', decAsStrings.join(''));
		out += "}";
		return this.addPreAndPost('ruleset', out);
	}
});

exports.canStartWith = selector.canStartWith;

exports.parse = function (tokens, parser, container) {
	var ruleset = new Ruleset(parser, container);
	ruleset.debug('parse', tokens);

	// The current token is the first part of our selector
	ruleset.selectors = [];
	ruleset.declarations = [];
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

	nextToken = tokens.nextToken();

	if (nextToken.type == "S") {
		nextToken = tokens.nextToken();
	}

	// Read declarations
	var keepProcessing = true;

	while (keepProcessing) {
		switch (nextToken.type) {
			case "IDENT":
				ruleset.declarations.push(declaration.parse(tokens, parser, container));
				nextToken = tokens.getToken();
				break;

			case "COMMENT":
				ruleset.declarations.push(ruleComment.parse(tokens, parser, container));
				nextToken = tokens.getToken();
				break;

			case "S":
				// Skip
				nextToken = tokens.nextToken();
				break;

			case "BLOCK_CLOSE":
				// Valid end of the ruleset
				keepProcessing = false;
				break;

			default:
				// Invalid something
				ruleset.declarations.push(invalid.parse(tokens, parser, container));
				nextToken = tokens.getToken();
		}
	}

	if (nextToken.type != 'BLOCK_CLOSE') {
		base.unexpectedToken("expected_block_close", nextToken);
	}

	tokens.next();

	return ruleset;
};
