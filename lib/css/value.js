var base = require('./base');
var block = require('./block');
var util = require('../util');

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	lastToken: function () {
		if (! this.list.length) {
			return null;
		}

		return this.list[this.list.length - 1];
	},

	/* Sets flags on the object if this has a priority */
	handlePriority: function () {
		var last = this.lastToken();

		if (last && last.type == "IMPORTANT") {
			this.list.pop();
			this.important = true;
			this.removeWhitespaceAtEnd();
		}
	},

	/* Whitespace at the end can be safely removed */
	removeWhitespaceAtEnd: function () {
		last = this.lastToken();

		if (last && last.type == "S") {
			this.list.pop();
		}
	},

	toString: function () {
		this.debug('toString', this.list);
		out = "";
		this.list.forEach(function (v) {
			if (v.content) {
				// Token object
				out += v.content;
			} else {
				// Block
				out += v.toString();
			}
		});

		if (this.important) {
			out += this.parser.options.important;
		}

		return this.addPreAndPost('value', out);
	}
});


exports.canStartWith = function () {
	return false;  // Not used in automatic pattern matching
};

var isPartOfValue = function (token) {
	if (! token) {
		return false;
	}

	if (token.type == 'SEMICOLON' || token.type == 'BLOCK_CLOSE') {
		return false;
	}

	return true;
};

exports.parse = function (tokens, parser, container) {
	var value = new Value(parser, container);
	value.debug('parse', tokens);
	var token = tokens.getToken();

	if (token.type == "S") {
		token = tokens.nextToken();
	}

	while (isPartOfValue(token)) {
		if (token.type == 'BLOCK_OPEN') {
			value.add(block.parse(tokens, parser, container));
			token = tokens.getToken();
		} else {
			value.add(token);
			token = tokens.nextToken();
		}
	}

	value.removeWhitespaceAtEnd();
	value.handlePriority();

	if (token.type == "SEMICOLON") {
		tokens.next();
	}

	return value;
};