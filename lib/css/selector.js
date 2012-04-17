"use strict";

var base = require('./base');
var util = require('../util');

var Selector = base.baseConstructor();

util.extend(Selector.prototype, base.base, {
	name: "selector",

	toString: function () {
		this.debug('toString', this.list);
		var simpleSelectors = [];
		var building = "";
		var myself = this;

		var done = function () {
			if (building !== "") {
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
					building += myself.addWhitespace('combinator', token.content);
					break;

				default:
					building += token.toString();
					break;
			}
		});

		done();
		return simpleSelectors.join(this.bucket.options.selector_whitespace);
	}
});

exports.canStartWith = base.selectorCanStartWith;

exports.parse = function (tokens, bucket, container) {
	var selector = new Selector(bucket, container);
	selector.debug('parse', tokens);
	var token = tokens.getToken();

	while (token && (token.type == 'S' || exports.canStartWith(token, tokens, bucket))) {
		if (token.type == "COMBINATOR") {
			selector.add(token);
			token = tokens.nextToken();

			if (token && token.type == 'S') {
				token = tokens.nextToken();
			}

			if (! token || token.type == 'COMBINATOR' || ! exports.canStartWith(token, tokens, bucket)) {
				bucket.parser.addError('illegal-token-after-combinator', token);
				var invalidCss1 = bucket.invalid.parse(null, bucket, container);
				invalidCss1.addList(selector.list);
				invalidCss1.consume(tokens);
				return invalidCss1;
			}
		} else if (token.type == 'COLON') {
			var oldTokens = [ token ];
			var pseudoToUse = bucket.pseudoclass;
			var potentialError = 'ident-after-colon';
			token = tokens.nextToken();

			if (token && token.type == 'COLON') {
				potentialError = 'ident-after-double-colon';
				pseudoToUse = bucket.pseudoelement;
				oldTokens.push(token);
				token = tokens.nextToken();
			}

			if (! token || token.type != 'IDENT') {
				bucket.parser.addError(potentialError, token);
				var invalidCss2 = bucket.invalid.parse(null, bucket, container);
				invalidCss2.addList(selector.list);
				invalidCss2.addList(oldTokens);
				invalidCss2.consume(tokens);
				return invalidCss2;
			}

			var pseudoCss = pseudoToUse.parse(tokens, bucket, this);
			selector.add(pseudoCss);
			token = tokens.getToken();
		} else if (token.type == "S") {
			var nextToken = tokens.getToken(1);

			if (nextToken && nextToken.type != "COMBINATOR") {
				selector.add(token);
			}

			token = tokens.nextToken();
		} else {
			selector.add(token);
			token = tokens.nextToken();
		}
	}

	return selector;
};
