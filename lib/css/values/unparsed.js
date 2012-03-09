var base = require('./base');
var util = require('../../util');

var Unparsed = function (list, parser, container) {
	this.list = list;
	this.parser = parser;
	this.container = container;
};

util.extend(Unparsed.prototype, base.base, {
	name: 'unparsed',

	advance: function () {
		if (! this.list.length) {
			return null;
		}

		var out = this.list.shift();

		this.skipWhitespace();
		return out;
	},

	canMatch: function (possibilities, container) {
		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (possibilities.length) {
			var t = possibilities.shift();
			if (typeof t == 'string') {
				if (this.list[0].content.toLowerCase() == t.toLowerCase()) {
					var tokens = this.clone();
					var v = tokens.advance();
					return {
						tokens: tokens,
						value: v
					};
				}
			} else if (typeof t == 'object') {
				if (typeof t.parse == 'function') {
					var parse = t.parse(this, container.parser, container);

					if (parse) {
						return parse;
					}
				} else {
					throw "canMatch against object without parse";
				}
			} else {
				throw "canMatch against " + (typeof t);
			}
		}

		return null;
	},

	clone: function () {
		return new Unparsed(this.list.slice(0), this.parser, this.container);
	},

	length: function () {
		return this.list.length;
	},

	getTokens: function () {
		return this.list;
	},

	isContent: function (content) {
		return this.list.length && this.list[0].content == content;
	},

	isTypeContent: function (type, content) {
		return this.list.length && this.list[0].type == type && this.list[0].content.toLowerCase() == content;
	},

	isType: function (type) {
		return this.list.length && this.list[0].type == type;
	},

	shift: function () {
		return this.list.shift();
	},

	skipWhitespace: function () {
		if (this.list.length && this.list[0].type == 'S') {
			this.list.shift();
		}
	}
});

exports.constructor = Unparsed;
