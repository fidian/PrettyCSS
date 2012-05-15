"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoclass = base.baseConstructor();

util.extend(Pseudoclass.prototype, base.base, {
	name: "pseudoclass",

	toString: function () {
		this.debug('toString', this.list);
		return this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	if (token.type != 'COLON') {
		return false;
	}

	var next = tokens.getToken(1);

	if (next.type == 'IDENT') {
		return true;
	}

	if (next.type == 'FUNCTION' && next.content.toLowerCase() == 'not(') {
		return true;
	}

	if (next.type == 'COLON') {
		// Do not add a warning here and let pseudoelement handle this
		return false;
	}

	bucket.parser.addError('ident-after-colon', token);
	return false;
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoclass(bucket, container);
	pseudo.debug('parse', tokens);

	// Colon
	var token = tokens.getToken();
	pseudo.add(token);

	// ident or function
	token = tokens.nextToken();
	pseudo.add(token);
	tokens.next();

	// Handle function
	if (token.type == 'FUNCTION') {
		pseudo.debug('parse function');
		var depth = 1;
		var selectorTokens = [];
		var invalidCss = null;
		token = tokens.getToken();

		while (tokens.anyLeft() && depth) {
			if (token.type == 'FUNCTION' || token.content == '(') {
				depth ++;
			} else if (token.type == 'PAREN_CLOSE') {
				depth --;
			}

			if (depth) {
				selectorTokens.push(token);
				token = tokens.nextToken();
			}
		}

		var tempTokenizer = bucket.tokenizer.tokenize('', bucket.options);
		tempTokenizer.tokens = selectorTokens;
		pseudo.debug(tempTokenizer);

		if (! tempTokenizer.anyLeft() || ! bucket.selector.canStartWith(tempTokenizer.getToken(), tempTokenizer, bucket)) {
			pseudo.debug('none left or does not start a selector');
			invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(this.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		var sel = bucket.selector.parse(tempTokenizer, bucket, pseudo);
		token = tokens.getToken();

		if (token.type != 'PAREN_CLOSE') {
			pseudo.debug('missing close paren');
			invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(this.list);
			invalidCss.addList(sel.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		pseudo.add(sel);
		pseudo.add(token);
		tokens.next();
	}

	return pseudo;
};
