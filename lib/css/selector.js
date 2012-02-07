var base = require('./base');

var Selector = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "selector",
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

exports.parse = function (tokens, parser) {
	var selector = new Selector(parser, 'selector');
	selector.debug('parse', tokens);
	var token = tokens.getToken();

	while (token.type == 'S' || exports.canStartWith(token)) {
		selector.add(token);

		if (token.type == "COMBINATOR") {
			token = tokens.nextToken();

			if (token.type == 'S') {
				selector.add(token);
				token = tokens.nextToken();
			}

			if (token.type == 'COMBINATOR' || ! exports.canStartWith(token)) {
				base.unexpectedToken("expected_selector_after_combinator", token);
			}
		} else if (token.type == 'COLON' || token.type == "COMBINATOR") {
			token = tokens.nextToken();

			if (token.type != 'IDENT') {
				base.unexpectedToken("expected_ident_after_ident", token);
			}
		} else {
			token = tokens.nextToken();
		}
	}

	return selector;
};
