var countNewlines = function (str) {
	return str.split("\n").length;
};

var patterns = {};
patterns.nonascii = "[^\\0-\\237]";
patterns.w = "[ \\t\\r\\n\\f]*";
patterns.unicode = "\\\\[0-9a-f]{1,6}(\\r\\n|[ \\n\\r\\t\\f])?";
patterns.num = "[0-9]+|[0-9]*\\.[0-9]+";
patterns.escape = patterns.unicode + "|\\\\[^\\n\\r\\f0-9a-f]";
patterns.nmstart = "[_a-z]|" + patterns.nonascii + "|" + patterns.escape;
patterns.nmchar = "[_a-z0-9-]|" + patterns.nonascii + "|" + patterns.escape;
patterns.name = patterns.nmchar + "+";
patterns.ident = "[-]?" + patterns.nmstart | patterns.nmchar + "*";
patterns.nl = "\\n|\\r\\n|\\r|\\f";
patterns.string1 = "\\\"([^\\n\\r\\f\\\\\"]|\\\\" + patterns.nl + "|" + patterns.escape + ")*\\\"";
patterns.string2 = "\\'([^\\n\\r\\f\\\\']|\\\\" + patterns.nl + "|" + patterns.escape + ")*\\'";
patterns.string = patterns.string1 + "|" + patterns.string2;
patterns.badstring1 = "\\\"([^\\n\\r\\f\\\\\"]|\\\\" + patterns.nl + "|" + patterns.escape + ")*\\\\?";
patterns.badstring2 = "\\'([^\\n\\r\\f\\\\']|\\\\" + patterns.nl + "|" + patterns.escape + ")*\\\\?";
patterns.badstring = patterns.badstring1 + "|" + patterns.badstring2;
patterns.badcomment1 = "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*"
patterns.badcomment2 = "\\/\\*[^*]*(\\*+[^/*][^*]*)*"
patterns.badcomment = patterns.badcomment1 + "|" + patterns.badcomment2;
patterns.baduri1 = "url\\(" + patterns.w + "([!#$%&*-~]|" + patterns.nonascii + "|" + patterns.escape + ")*" + patterns.w;
patterns.baduri2 = "url\\(" + patterns.w + patterns.string + patterns.w;
patterns.baduri3 = "url\\(" + patterns.w + patterns.badstring;
patterns.baduri = patterns.baduri1 + "|" + patterns.baduri2 + "|" + patterns.baduri3;

// I made this one for quicker matching of url(...) and similar structures
patterns.parameter = patterns.w + "(" + patterns.string + "|([!#$%&*-\\[\\]-~]|" + patterns.nonascii + "|" + patterns.escape + "))" + patterns.w

var tokenizer = function (str) {
	this.tokens = [];
	this.tokenIndex = 0;
};

tokenizer.prototype.addToken = function (type, content, line) {
	this.tokens.push({
		"line": line,
		"type": type,
		"content": content,
		"comment": null
	});
};

tokenizer.prototype.getNextToken = function () {
	this.tokenIndex ++;
	return this.getToken();
};

tokenizer.prototype.getToken = function () {
	if (this.tokens[this.tokenIndex]) {
		return this.tokens[this.tokenIndex];
	}

	return null;
};

tokenizer.prototype.tokenize = function (str) {
	// Standardize newlines to \n
	str = str.replace(/\r\ng/, "\n").replace(/\r/g, "\n");
	var leadingWhitespace = new RegExp("^" + patterns.w);
	var newlinesTotal = countNewlines(str);
	var tokenTries = {
		"IDENT": patterns.ident,
		"ATKEYWORD": "@" + patterns.ident,
		"STRING": patterns.string,
		"BAD_STRING": patterns.badstring,
		"BAD_URI": patterns.baduri,
		"BAD_COMMENT": patterns.badcomment,
		"HASH": patterns.name,
		"NUMBER": patterns.num,
		"PERCENTAGE": patterns.num + "%",
		"DIMENSION": patterns.num + patterns.ident,
		"URI": "url\\(" + patterns.parameter + "\\)",
		"UNICODE_RANGE": "u\\+[0-9a-f?]{1,6}(-[0-9a-f]{1,6})?",  // Renamed from spec
		"CDO": "<!--",
		"CDC": "-->",
		":": ":",
		";": ";",
		"{": "\\{",
		"}": "\\}",
		"(": "\\(",
		")": "\\)",
		"[": "\\[",
		"]": "\\]",
		"S": "[\\t\\r\\n\\f]+", // Like w but non-optional
		"COMMENT": "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/",
		"FUNCTION": patterns.ident + "\\(",
		"INCLUDES": "~=",
		"DASHMATCH": "\\|=",
		"DELIM": '[\\s\\S]'  // "." doesn't match newlines
	};

	for (idx in tokenTries) {
		tokenTries[idx] = new RegExp('^' + tokenTries[idx], 'i');
	}

	while (str.length) {
		// Remove leading whitespace
		str = str.replace(leadingWhitespace, '');

		// Determine token's line number by working backwards
		var lineNumber = newlinesTotal - countNewlines(str);

		// Determine token type
		var type = null;
		var match = str.charAt(0);

		for (idx in tokenTries) {
			var hit = str.match(tokenTries[idx]);
			if (hit.length) {
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

exports.tokenize = function (str) {
	var cr = new tokenizer();
	cr.tokenize(str);
	return cr;
};
