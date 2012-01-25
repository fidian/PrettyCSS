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
		COMMENT: "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/",
		// Change to "ATKEYWORD"?
		IMPORT_SYM: "@import",
		IMPORTANT_SYM: "!{w}important",
		IDENT: "({ident}?{pseudo}+|{ident}{pseudo}*)",
		STRING: "{string}",
		UNIT: "{num}(%|(pt|mm|cm|pc|in|px|em|ex)(?={notnm}))?",  // Condensed
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

var patterns_v2 = function () {
	var letter = function (l) {
		var str = l + "|\\\\0{0,4}(";
		str += l.toLowerCase().charCodeAt(0).toString(16);
		str += "|";
		str += l.toUpperCase().charCodeAt(0).toString(16);
		str += "){s_delim}?";

		if ("abcdef".indexOf(l.toLowerCase()) == -1) {
			str += "|\\\\" + l;
		}

		return str;
	};

	var extraExpansion = {
		badcomment: "{badcomment1}|{badcomment2}",
		badcomment1: "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*", // EOF
		badcomment2: "\\/\\*[^*]*(\\*+[^/*][^*]*)*", // EOF
		badstring: "{badstring1}|{badstring2}",
		badstring1: "\\\"([^\\n\\r\\f\\\\\"]|\\\\{nl}|{escape})*\\\\?", // " + EOF
		badstring2: "\\'([^\\n\\r\\f\\\\']|\\\\{nl}|{escape})*\\\\?", // ' + EOF
		baduri: "{baduri1}|{baduri2}|{baduri3}",
		baduri1: "url\\({w}([!#$%&*-\\[\\]-~]|{nonascii}|{escape})*{w}", // unquoted string, no closing parenthesis
		baduri2: "url\\({w}{string}{w}", // unclosed parenthesis
		baduri3: "url\\({w}{badstring}", // unquoted string
		comment: "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/",
		escape: "{unicode}|\\\\[^\\r\\n\\f0-9a-f]",
		h: "[0-9a-f]",
		ident: "-?{nmstart}{nmchar}*",
		name: "{nmchar}+",
		nl: "\\r\\n|\\n|\\r|\\f",
		nmchar: "[_a-z0-9-]|{nonascii}|{escape}",
		nmstart: "[_a-z]|{nonascii}|{escape}",
		nonascii: "[\\xa0-\\uffff]", // Go though highest allowable char value
		num: "[0-9]+|[0-9]*\\.[0-9]+",
		s: "[ \\t\\r\\n\\f]+",
		string: "{string1}|{string2}",
		string1: "\\\"([^\\n\\r\\f\\\\\"]|\\\\{nl}|{escape})*\\\"",  // "
		string2: "\\'([^\\n\\r\\f\\\\']|\\\\{nl}|{escape})*\\'", // '
		unicode: "\\\\{h}{1,6}{s_delim}?",
		url: "([!#$%&*-~]|{nonascii}|{escape})*",
		w: "{s}?",

		// Not in spec, but useful
		s_delim: "\\r\\n|[ \\t\\r\\n\\f]",
	};

	letterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	for (var l in letterList) {
		l = letterList[l];
		extraExpansion[l] = letter(l);
	}

	// Order matters for the tokens
	var tokens = {
		WHITESPACE: "{s}",  // renamed from S
		COMMENT: "/\\*[^*]*\\*+([^/*][^*]*\\*+)*/",
		BAD_COMMENT: "{badcomment}",
		CDC: "-->",
		CDO: "<!--",
		INCLUDES: "!=",
		DASHMATCH: "|=",
		STRING: "{string}",
		BAD_STRING: "{badstring}",
		IDENT: "{ident}",
		HASH: "#{name}",
		// Change to ATKEYWORD?
		IMPORT_SYM: "@{I}{M}{P}{O}{R}{T}",
		PAGE_SYM: "@{P}{A}{G}{E}",
		MEDIA_SYM: "@{M}{E}{D}{I}{A}",
		CHARSET_SYM: "@charset ",
		IMPORTANT_SYM: "!({w}|{comment})*{I}{M}{P}{O}{R}{T}{A}{N}{T}",
		UNIT: "{num}({ident}|%)?",
		URL: "url\\({w}({string}|{url}){w}\\)", // Renamed from URI
		BAD_URL: "{baduri}",
		FUNCTION: "{ident}\\(",
		TEXT: ".",  // No more illegal characters?
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

			if (hit) {
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
