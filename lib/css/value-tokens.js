var base = require('./base');
var util = require('../util');
var valuebase = require('./values/value-base');

var ValueTokens = function (list) {
	this.list = list;
};

util.extend(ValueTokens.prototype, {
	advance: function () {
		if (! this.list.length) {
			return null;
		}

		var out = this.list.shift();

		if (this.list.length && this.list[0].type == 'S') {
			this.list.shift();
		}

		return out;
	},

	clone: function () {
		return new ValueTokens(this.list.slice(0));
	},

	firstToken: function () {
		if (this.list.length) {
			return this.list[0];
		}

		return null;
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

	parseColorNumber: function (obj, consumeComma) {
		if (! this.list.length || ! this.isType('UNIT')) {
			return null;
		}

		var t = this.firstToken();

		if (! /^[0-9]*\.?[0-9]+%?/.test(t.content)) {
			return null;
		}

		if (t.content.charAt(t.content.length - 1) == '%') {
			valuebase.warnIfOutsideRange(obj, t, t.content, 0, 100);
		} else {
			valuebase.warnIfOutsideRange(obj, t, t.content, 0, 255);
		}

		this.advance();

		if (consumeComma && this.isTypeContent('OPERATOR', ',')) {
			this.advance();
		}

		return t;
	},

	shift: function () {
		return this.list.shift();
	}
});

exports.constructor = ValueTokens;
