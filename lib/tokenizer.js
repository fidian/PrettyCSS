var fs = require('fs');

var countNewlines = function (str) {
	return str.split(/\r?\n|\r/g).length - 1;
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

var makeTokenPatterns = function () {
	var extraExpansion = {
		escape: "{unicode}|\\\\([\\x20-\\x7e]|{nonascii})",
		h: "[0-9a-f]",
		ident: "[-]?{nmstart}{nmchar}*",
		name: "{nmchar}+",
		nl: "\\n|\\r\\n|\\r|\\f",
		nmchar: "[_a-z0-9-]|{nonascii}|{escape}",
		nmstart: "[_a-z]|{nonascii}|{escape}",
		nonascii: "[\\x80-\\xd7ff\\xe000\\xfffd]",  // Can't include \x10000-\x10ffff -- too high for JavaScript
		num: "[0-9]+|[0-9]*\\.[0-9]+",
		string: "\\\"({stringchar}|\\')*\\\"|\\'({stringchar}|\\\")*\\'",
		stringchar: "{urlchar}| |\\\\{nl}",
		unicode: "\\\\{h}{1,6}({nl}|{wc})?",
		urlchar: "[\\t\x21\x23-\x7e]|{nonascii}|{escape}",
		w: "{wc}*",
		wc: "[ \\t\\r\\n\\f]"
	};

	var tokens = {
		UNIT: "{num}({ident}|%)?",  // All forms of numbers and units
		FUNCTION: "{ident}\\(",  // Purposely not segregate url
		IDENT: "{ident}",
		AT_SYMBOL: "@{name}",  // All @ symbol uses
		STRING: "{string}",
		UNICODE_RANGE: "U\\+({h}|\\?){1,6}(-{h}{1,6})?",
		CDO: "<!--",
		CDC: "-->",
		S:  "{wc}+",
		COMMENT: "\\/\\*[^*]*\\*+([^/][^*]*\\*+)*\\/",
		MATCH: "[~|^$*]=",
		BOM: "\xfeff",  // Byte order mark
		CHAR: "[^'\"]",  // Matches nearly anything
		UNMATCHED: ".",  // Must be last
	};

	return makeTokenRegExp(tokens, extraExpansion);
}

var Tokenizer = function (options) {
	this.options = options;
	this.tokens = [];
	this.tokenIndex = 0;
	this.tokenPatterns = makeTokenPatterns();
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
	var match = '';
	var lineNumber = 1;

	while (str.length) {
		// Count the newlines from the previous token
		lineNumber += countNewlines(match);

		// Blank out the info
		var type = null;
		var match = '';

		// Find the pattern that matches the best
		for (idx in this.tokenPatterns) {
			if (type === null) {
				var hit = str.match(this.tokenPatterns[idx]);

				if (hit) {
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
