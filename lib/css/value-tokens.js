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

	parseAlpha: function (obj) {
		if (! this.list.length || ! this.isType('UNIT')) {
			return null;
		}

		var t = this.firstToken();
		var normalized = t.content;

		if (! /^[-+]?[0-9]*\.?[0-9]+$/.test(normalized)) {
			return null;
		}

		normalized = valuebase.warnIfOutsideRange(obj, t, normalized, 0, 1);
		this.advance();

		return normalized;
	},

	parseAngle: function (obj, consumeComma) {
		if (! this.list.length || ! this.isType('UNIT')) {
			return null;
		}

		var t = this.firstToken();
		var normalized = t.content;

		if (! /^[-+]?[0-9]*\.?[0-9]+$/.test(normalized)) {
			return null;
		}

		valuebase.warnIfNotInteger(obj, t, normalized);
		normalized = Math.round(normalized);
		normalized = valuebase.warnIfOutsideRange(obj, t, normalized, 0, 360);
		this.advance();

		while (normalized < 0) {
			normalized += 360;
		}

		normalized %= 360;

		if (consumeComma && this.isTypeContent('OPERATOR', ',')) {
			this.advance();
		}

		return normalized;
	},

	parseColorNumber: function (obj, consumeComma) {
		if (! this.list.length || ! this.isType('UNIT')) {
			return null;
		}

		var t = this.firstToken();
		var normalized = t.content;
		var suffix = '';
		var max = 255;

		if (! /^[-+]?[0-9]*\.?[0-9]+%?$/.test(normalized)) {
			return null;
		}

		if (normalized.charAt(t.content.length - 1) == '%') {
			// Remove %
			normalized = normalized.substring(0, normalized.length - 1);
			suffix = '%';
			max = 100;
		}

		valuebase.warnIfNotInteger(obj, t, normalized);
		normalized = valuebase.warnIfOutsideRange(obj, t, normalized, 0, max);

		this.advance();

		if (consumeComma && this.isTypeContent('OPERATOR', ',')) {
			this.advance();
		}

		return normalized + suffix;
	},

	shift: function () {
		return this.list.shift();
	}
});

exports.constructor = ValueTokens;
