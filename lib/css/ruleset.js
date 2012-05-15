"use strict";

var base = require('./base');
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

		var out = selAsStrings.join(this.bucket.options.selector_comma);
		out = this.addWhitespace('selector', out);

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('ruleset', out);
	}
});

exports.canStartWith = base.selectorCanStartWith;

exports.parse = function (tokens, bucket, container) {
	var ruleset = new Ruleset(bucket, container);
	var lastToken = tokens.getToken();
	ruleset.debug('parse', tokens);

	// The current token is the first part of our selector
	ruleset.selectors = [];
	ruleset.block = null;
	ruleset.selectors.push(bucket.selector.parse(tokens, bucket, ruleset));

	// Add additional selectors
	var nextToken = tokens.getToken();

	var makeInvalid = function () {
		var invalidCss = bucket.invalid.parse(null, bucket, container);

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
		lastToken = nextToken;
		nextToken = tokens.nextToken();

		if (nextToken.type == 'S') {
			lastToken = nextToken;
			nextToken = tokens.nextToken();
		}

		// After commas come another selector
		if (! bucket.selector.canStartWith(nextToken, tokens, bucket)) {
			bucket.parser.addError("selector-expected", nextToken);
			return makeInvalid();
		}

		ruleset.selectors.push(bucket.selector.parse(tokens, bucket, ruleset));

		// Don't advance the token pointer - use getToken here
		lastToken = nextToken;
		nextToken = tokens.getToken();
	}

	if (nextToken && nextToken.type == "S") {
		lastToken = nextToken;
		nextToken = tokens.nextToken();
	}

	if (! nextToken || nextToken.type != 'BLOCK_OPEN') {
		var errToken = nextToken || lastToken;
		bucket.parser.addError('block-expected', errToken);
		return makeInvalid();
	}

	ruleset.block = bucket.block.parse(tokens, bucket, ruleset);
	ruleset.block.reparseAs('rule');
	return ruleset;
};
