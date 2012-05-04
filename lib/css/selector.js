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
				selector.debug('illegal token after combinator');
				bucket.parser.addError('illegal-token-after-combinator', token);
				var invalidCss1 = bucket.invalid.parse(null, bucket, container);
				invalidCss1.addList(selector.list);
				invalidCss1.consume(tokens);
				return invalidCss1;
			}
		} else if (token.type == 'COLON') {
			var result = null;

			if (bucket.pseudoelement.canStartWith(token, tokens, bucket)) {
				result = bucket.pseudoelement.parse(tokens, bucket, selector);
			} else if (bucket.pseudoclass.canStartWith(token, tokens, bucket)) {
				result = bucket.pseudoclass.parse(tokens, bucket, selector);
			} else {
				// error codes were already added
				selector.debug('not parsed as a pseudo-thing');
				var invalidCss2 = bucket.invalid.parse(null, bucket, container);
				invalidCss2.addList(selector.list);
				invalidCss2.consume(tokens);
				return invalidCss2;
			}

			selector.add(result);
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
