var base = require('./base');
var invalid = require('./invalid');
var pseudoclass = require('./pseudoclass');
var pseudoelement = require('./pseudoelement');
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
					building += myself.addWhitespace('combinator', token.content);
					break;

				default:
					building += token.toString();
			}
		});

		done();
		return simpleSelectors.join(this.parser.options.selector_whitespace);
	}
});

exports.canStartWith = function (token, tokens) {
	switch (token.type) {
		case "ATTRIB":
		case "CLASS":
		case "COLON":
		case "COMBINATOR":
		case 'HASH':
		case 'IDENT':
			return true;
	}

	return false;
};

exports.parse = function (tokens, parser, container) {
	var selector = new Selector(parser, container);
	selector.debug('parse', tokens);
	var token = tokens.getToken();

	while (token && (token.type == 'S' || exports.canStartWith(token))) {
		if (token.type == "COMBINATOR") {
			selector.add(token);
			token = tokens.nextToken();

			if (token && token.type == 'S') {
				token = tokens.nextToken();
			}

			if (! token || token.type == 'COMBINATOR' || ! exports.canStartWith(token)) {
				parser.addError('illegal_token_after_combinator', token);
				var invalidCss = invalid.parse(null, parser, container);
				invalidCss.addList(selector.list);
				invalidCss.consume(tokens);
				return invalidCss;
			}
		} else if (token.type == 'COLON') {
			var oldTokens = [ token ];
			var pseudoToUse = pseudoclass;
			var potentialError = 'ident_after_colon';
			token = tokens.nextToken();

			if (token && token.type == 'COLON') {
				potentialError = 'ident_after_double_colon';
				pseudoToUse = pseudoelement;
				oldTokens.push(token);
				token = tokens.nextToken();
			}

			if (! token || token.type != 'IDENT') {
				parser.addError(potentialError, token);
				var invalidCss = invalid.parse(null, parser, container);
				invalidCss.addList(selector.list);
				invalidCss.addList(oldTokens);
				invalidCss.consume(tokens);
				return invalidCss;
			}

			var pseudoCss = pseudoToUse.parse(tokens, parser, this);
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
