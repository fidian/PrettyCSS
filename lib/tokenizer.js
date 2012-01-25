var fs = require('fs');

var countNewlines = function (str) {
	return str.split(/\r?\n|\r/g).length;
};

var makeTokenRegExp = function (tokenPatt, extraExpansion) {
	var subPat = /{([a-z][a-z0-9_]*)}/ig;
	var result = {};

	for (var i in tokenPatt) {
		var pattern = tokenPatt[i];

		while (pattern.match(subPat)) {
			pattern = pattern.replace(subPat, function (str, p1) {
				if (tokenPatt[p1]) {
					return "(" + tokenPatt[p1] + ")";
				}

				if (extraExpansion[p1]) {
					return "(" + extraExpansion[p1] + ")";
				}

				throw "Invalid pattern referenced: " + p1;
			});
		}

		// All tokens match the beginning of the string
		// CSS is case insensitive
		result[i] = new RegExp("^" + pattern, 'i');
	}

	return result;
};

var patterns_v1 = function () {
	var extraExpansion = {
		d: "[0-9]",
		escape: "{unicode}|\\\\[ -~]|{latin1}",
		ident: "{nmstrt}{nmchar}*",
		latin1: "[\\xa8-\\xfe]",
		name: "{nmchar}+",
		nmchar: "[-a-z0-9]|{latin1}|{escape}",
		nmstrt: "[a-z]|{latin1}|{escape}",
		notnm: "[^-a-z0-9\\\\]|{latin1}",
		num: "{d}+|{d}*\\.{d}+",
		string: "\\\"({stringchar}|\\')*\\\"|\\'({stringchar}|\\\")*\\'",
		stringchar: "{escape}|{latin1}|[ !#$%&(-~]",
		unicode: "\\\\[0-9a-f]{1,4}",
		w: "[ \\t\\n\\r]*", // Added \r

		// Not in spec, but useful
		pseudo: ":(link|visited|active|first-(line|letter))|#{name}|\\.{name}",
		rgb_num: "{w}{num}%?{w}",
		url_not_string: "([^ \\n\\'\\\")]|\\\\\\ |\\\\\\'|\\\\\\\"|\\\\\\))+"
	};

	// Order matters for the tokens
	var tokens = {
		COMMENT: "/\\*[^*]*\\*+([^/*][^*]*\\*+)*/",
		// Change to "ATKEYWORD"?
		IMPORT_SYM: "@import",
		IMPORTANT_SYM: "!{w}important",
		IDENT: "{ident}?{pseudo}*",
		STRING: "{string}",
		UNIT: "{num}(%|(pt|mm|cm|pc|in|px|em|ex)(?={notnm}))?",
		// Combine RGB and URL?
		RGB: "rgb\\({rgb_num}\\,{rgb_num}\\,{rgb_num}\\)",
		URL: "url\\({w}({string}|{url_not_string){w}\\)",
		TEXT: "[-/+{};,#:]",  // Combined into one token named TEXT
		WHITESPACE: "[ \\t\\n\\r]+", // Like {w} but not optional; added \r
		CDC: "-->",
		CDO: "<!--",
		ILLEGAL: "."
	};

	return makeTokenRegExp(tokens, extraExpansion);
}

var Tokenizer = function (str) {
	this.tokens = [];
	this.tokenIndex = 0;
	this.tokenPatterns = patterns_v1();
};

Tokenizer.prototype.addToken = function (type, content, line) {
	this.tokens.push({
		"line": line,
		"type": type,
		"content": content
	});
};

Tokenizer.prototype.getNextToken = function () {
	this.tokenIndex ++;
	return this.getToken();
};

Tokenizer.prototype.getToken = function () {
	if (this.tokens[this.tokenIndex]) {
		return this.tokens[this.tokenIndex];
	}

	return null;
};

Tokenizer.prototype.tokenize = function (str) {
	// Standardize newlines to \n
	str = str.replace(/(\r?\n|\r)/g, "\n");
	var newlinesTotal = countNewlines(str);

	while (str.length) {
		// Determine token's line number by checking the remaining newlines
		var lineNumber = newlinesTotal - countNewlines(str) + 1;

		// Determine token type
		var type = null;
		var match = str.charAt(0);

		for (idx in this.tokenPatterns) {
			var hit = str.match(this.tokenPatterns[idx]);

			if (hit && hit[0].length) {
				if (type == null || match.length < hit[0].length) {
					type = idx;
					match = hit[0];
				}
			}
		}

		this.addToken(type, match, lineNumber);
		str = str.substr(match.length);
	}
};

exports.tokenize = function (str, options) {
	var cr = new Tokenizer(options);
	cr.tokenize(str);
	return cr;
};

exports.tokenizeFile = function (filename, encoding, callback, options) {
	if (! options) {
		options = callback;
		callback = encoding;
		encoding = 'utf-8';
	}

	fs.readFile(filename, encoding, function (err, data) {
		if (err) {
			callback(err);
		} else {
			cr = new Tokenizer(options);
			cr.tokenize(data);
			callback(err, cr);
		}
	});
};
