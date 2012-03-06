var base = require('./base');
var block = require('./block');
var util = require('../util');
var valuetokens = require('./value-tokens');

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	firstToken: function () {
		return this.list[0];
	},

	getTokens: function () {
		var t = new valuetokens.constructor(this.list);
		return t;
	},

	/* Sets flags on the object if this has a priority */
	handlePriority: function () {
		var last = this.lastToken();

		if (last && last.type == "IMPORTANT") {
			this.list.pop();
			this.length = this.list.length;
			this.important = true;
			this.removeWhitespaceAtEnd();
		}
	},

	lastToken: function () {
		if (! this.list.length) {
			return null;
		}

		return this.list[this.list.length - 1];
	},

	getLength: function () {
		return this.list.length;
	},

	prepend: function (value) {
		this.list.unshift(value);
	},

	/* Whitespace at the end can be safely removed */
	removeWhitespaceAtEnd: function () {
		last = this.lastToken();

		if (last && last.type == "S") {
			this.list.pop();
			this.length = this.list.length;
		}
	},

	setList: function (list) {
		if (list instanceof valuetokens.constructor) {
			this.list = list.list.slice(0);
		} else {
			this.list = list.slice(0);
		}

		this.length = this.list.length;
	},

	shift: function () {
		return this.list.shift();
	},

	toString: function () {
		this.debug('toString', this.list);
		out = "";
		this.list.forEach(function (v) {
			if (v.content) {
				// Token object
				out += v.content;
			} else {
				// Block or parsed value
				out += v.toString();
			}
		});

		if (this.important) {
			out += this.parser.options.important;
		}

		return this.addWhitespace('value', out);
	}
});


exports.canStartWith = function (token, tokens) {
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

	if (token && token.type == "S") {
		token = tokens.nextToken();
	}

	while (isPartOfValue(token)) {
		if (token.type == 'BLOCK_OPEN') {
			value.add(block.parse(tokens, parser, value));
			token = tokens.getToken();
		} else {
			value.add(token);
			token = tokens.nextToken();
		}
	}

	value.removeWhitespaceAtEnd();
	value.handlePriority();

	if (token && token.type == "SEMICOLON") {
		tokens.next();
	}

	return value;
};
