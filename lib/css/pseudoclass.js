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

	if (next.type == 'FUNCTION') {
		var nextContent = next.content.toLowerCase();

		if (nextContent === 'not(' || nextContent === 'nth-child(') {
			return true;
		}
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

	function isValidNth() {
		var t;

		if (functionToken.content.toUpperCase() !== 'NTH-CHILD(') {
			return false;
		}

		t = tempTokenizer.getToken();

		if (t.type !== 'UNIT') {
			return false;
		}

		if (!t.content.match(/^[-+]?([0-9]+|([0-9]+)?N)$/i)) {
			return false;
		}

		t = tempTokenizer.getToken(1);

		if (!t) {
			return true;
		}

		if (t.type !== 'UNIT') {
			return false;
		}

		if (!t.content.match(/^[-+]?[0-9]+$/)) {
			return false;
		}

		t = tempTokenizer.getToken(2);

		if (!t) {
			return true;
		}

		return false;
	}

	// Handle function
	if (token.type == 'FUNCTION') {
		pseudo.debug('parse function');
		var depth = 1;
		var selectorTokens = [];
		var invalidCss = null;
		var functionToken = token;
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

		if (! tempTokenizer.anyLeft()) {
			pseudo.debug('none left');
			invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(this.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		if (bucket.selector.canStartWith(tempTokenizer.getToken(), tempTokenizer, bucket)) {
			var sel = bucket.selector.parse(tempTokenizer, bucket, pseudo);
			token = tokens.getToken();

			if (token.type != 'PAREN_CLOSE') {
				pseudo.debug('missing close paren after selector');
				invalidCss = bucket.invalid.parse(null, bucket, container);
				invalidCss.addList(this.list);
				invalidCss.addList(sel.list);
				invalidCss.consume(tokens);
				return invalidCss;
			}

			pseudo.add(sel);
			pseudo.add(token);
		} else if (isValidNth(functionToken, tempTokenizer)) {
			token = tokens.getToken();

			if (token.type != 'PAREN_CLOSE') {
				pseudo.debug('missing close paren after nth-child');
				invalidCss = bucket.invalid.parse(null, bucket, container);
				invalidCss.addList(this.list);
				invalidCss.addList(selectorTokens.list);
				invalidCss.consume(tokens);
				return invalidCss;
			}
		
			selectorTokens.forEach(function (sel) {
				pseudo.add(sel);
			});
			pseudo.add(token);
		} else {
			pseudo.debug('does not start a selector nor is valid nth-child');
			invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(this.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		tokens.next();
	}

	return pseudo;
};
