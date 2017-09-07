"use strict";

var base = require('./base');
var util = require('../util');

var At = base.baseConstructor();

util.extend(At.prototype, base.base, {
	name: "at-rule",

	toString: function () {
		this.debug('toString', this.list);
		var ws = this.bucket.options.at_whitespace;
		var out = "";

		this.list.forEach(function (value) {
			if (value.type == "S") {
				out += ws;
			} else {
				out += value.content;
			}
		});

		if (this.block) {
			out += this.block.toString("atblock");
		}

		return this.addWhitespace('at', out);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'AT_SYMBOL';
};

exports.parse = function (tokens, bucket, container) {
	var at = new At(bucket, container);
	at.block = null;
	at.debug('parse', tokens);
	var token = tokens.getToken();

	if (token) {
		var type = token.content.toLowerCase();
	}

	// Eat until the first semicolon or the ending of a block
	while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		at.add(token);
		token = tokens.nextToken();
	}

	if (! token) {
		// Finished without hitting a semicolon nor a block
		return at;
	}

	if (token.type == 'SEMICOLON') {
		at.add(token);
		tokens.next();
		return at;
	}

	at.block = bucket.block.parse(tokens, bucket, at);

	switch (type) {
		case '@font-face':
			// Add a font
			at.block.reparseAs('font-face');
			break;

		case '@keyframes':
		case '@-moz-keyframes':
		case '@-ms-keyframes':
		case '@-o-keyframes':
		case '@-webkit-keyframes':
			// CSS3 animations
			at.block.reparseAs('keyframes');
			break;

		case '@media':
			// Stylesheet parser
			at.block.reparseAs('stylesheet');
			break;

		case '@page':
			// Paged media
			at.block.reparseAs('page');
			break;

		default:
			at.debug('Invalid type, so no block parsing for ' + type);
			break;
	}

	return at;
};
