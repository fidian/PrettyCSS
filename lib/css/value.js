"use strict";

var base = require('./base');
var util = require('../util');
var valueBucket = require('./valuebucket');

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	firstToken: function () {
		return this.list[0];
	},

	getTokens: function () {
		valueBucket.setCssBucket(this.bucket);
		var t = new valueBucket.unparsed.constructor(this.list, valueBucket, this);
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
		var last = this.lastToken();

		if (last && last.type == "S") {
			this.list.pop();
			this.length = this.list.length;
		}
	},

	setTokens: function (list) {
		this.list = list;
		this.length = this.list.length;
	},

	shift: function () {
		return this.list.shift();
	},

	toString: function () {
		this.debug('toString', this.list);
		var out = "";
		var myself = this;
		this.list.forEach(function (v) {
			if (v.content) {
				// Token object
				out += v.content;
			} else {
				// Block or parsed value
				out += v.toStringChangeCase(myself.bucket.options.valuesLowerCase);
			}
		});

		if (this.important) {
			out += this.bucket.options.important;
		}

		return this.addWhitespace('value', out);
	}
});


exports.canStartWith = function (token, tokens, bucket) {
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

exports.parse = function (tokens, bucket, container) {
	var value = new Value(bucket, container);
	value.debug('parse', tokens);
	var token = tokens.getToken();

	if (token && token.type == "S") {
		token = tokens.nextToken();
	}

	while (isPartOfValue(token)) {
		if (token.type == 'BLOCK_OPEN') {
			value.add(bucket.block.parse(tokens, bucket, value));
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
