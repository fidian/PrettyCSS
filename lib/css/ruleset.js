"use strict";

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

		var out = selAsStrings.join(this.parser.options.selector_comma);
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
	ruleset.selectors.push(selector.parse(tokens, parser, ruleset));

	// Add additional selectors
	var nextToken = tokens.getToken();

	var makeInvalid = function () {
		var invalidCss = invalid.parse(null, parser, container);

		for (var s in ruleset.selectors) {
			invalidCss.addList(ruleset.selectors[s].list);
		}

		if (nextToken) {
			invalidCss.consume(tokens);
		}

		return invalidCss;
	};

	while (nextToken && nextToken.type == 'OPERATOR' && nextToken.content == ',') {
		// Consume comma
		nextToken = tokens.nextToken();

		if (nextToken.type == 'S') {
			nextToken = tokens.nextToken();
		}

		// After commas come another selector
		if (! selector.canStartWith(nextToken)) {
			parser.addError("selector_expected", nextToken);
			return makeInvalid();
		}

		ruleset.selectors.push(selector.parse(tokens, parser, ruleset));

		// Don't advance the token pointer - use getToken here
		nextToken = tokens.getToken();
	}

	if (nextToken && nextToken.type == "S") {
		nextToken = tokens.nextToken();
	}

	if (! nextToken || nextToken.type != 'BLOCK_OPEN') {
		parser.addError('block_expected', nextToken);
		return makeInvalid();
	}

	ruleset.block = block.parse(tokens, parser, ruleset);
	return ruleset;
};
