var fs = require('fs');
var util = require('./util');
var wsPatternString = "[ \\t\\r\\n\\f]";

var countNewlines = function (str) {
	return str.split(/\r?\n|\r/g).length - 1;
};

var expandPatternToRegExp = function (pattern, expansion) {
	var subPat = /{([a-z][a-z0-9_]*)}/ig;
	pattern += "{w}";  // Also match additional whitespace at the end

	while (pattern.match(subPat)) {
		pattern = pattern.replace(subPat, function (str, p1) {
			if (expansion[p1]) {
				return "(" + expansion[p1] + ")";
			}

			throw "Invalid pattern referenced: " + p1;
		});
	}

	// All tokens match the beginning of the string
	// CSS is case insensitive, mostly
	return new RegExp("^" + pattern, 'i');
};

var getTokenDefs = function () {
	var expansion = {
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
		wc: wsPatternString
	};

	// Sorted mostly by having frequently used tokens appear first
	//    leading:  If the first character is in this string, try the pattern
	//    all:  Include this pattern as a fallback if the per-letter matches
	//          do not provide a hit
	//    pattern:  String portion of the RegExp pattern
	var tokens = {
		// Doesn't ever match anything since .leading is "" and .all is false
		S: {
			leading: "",
			all: false,
			pattern: "{wc}+",
		},
		// These must appear before IDENT
		UNIT: {
			leading: ".0123456789-", 
			all: false,
			pattern: "[-]?{num}({ident}|%)?"
		},  // All forms of numbers and units
		UNICODE_RANGE: {
			leading: "U", 
			all: false,
			pattern: "U\\+({h}|\\?){1,6}(-{h}{1,6})?"
		},

		CLASS: {
			leading: ".", 
			all: false,
			pattern: "\\.{ident}"
		},
		HASH: {
			leading: "#", 
			all: false,
			pattern: "#{name}"
		},
		ATTRIB: {
			leading: "[", 
			all: false,
			pattern: "\\[{w}{ident}{w}([~|^$*]?={w}({ident}|{string}){w})?{w}\\]"
		},
		AT_SYMBOL: {
			leading: "@", 
			all: false,
			pattern: "@{name}"
		},  // All @ symbols
		STRING: {
			leading: "\"'", 
			all: false,
			pattern: "{string}"
		},
		CDO: {
			leading: "<", 
			all: false,
			pattern: "<!--"
		},
		CDC: {
			leading: "-", 
			all: false,
			pattern: "-->"
		},
		COMMENT: {
			leading: "/", 
			all: false,
			pattern: "\\/\\*[^*]*\\*+([^/][^*]*\\*+)*\\/"
		},
		MATCH: {
			leading: "~|^$*=",
			all: false,
			pattern: "[~|^$*]?="
		},  // All of the matching tokens stay here
		BOM: {
			leading: "\xfeff", 
			all: false,
			pattern: "\xfeff"
		},  // Byte order mark
		IMPORTANT: {
			leading: "!",
			all: false,
			pattern: "!{w}important"
		},
		COMBINATOR: {
			leading: "+>",
			all: false,
			pattern: "[+>]"
		},
		OPERATOR: {
			leading: "/,",
			all: false,
			pattern: "[/,]",
		},
		COMMA: {
			leading: ",",
			all: false,
			pattern: ","
		},
		COLON: {
			leading: ":",
			all: false,
			pattern: ":"
		},
		SEMICOLON: {
			leading: ";",
			all: false,
			pattern: ";"
		},
		BLOCK_OPEN: {
			leading: "{",
			all: false,
			pattern: "\\{"
		},
		BLOCK_CLOSE: {
			leading: "}",
			all: false,
			pattern: "\\}"
		},
		PAREN_CLOSE: {
			leading: ")",
			all: false,
			pattern: "\\)"
		},
		URL: {
			leading: "uU",
			all: false,
			pattern: "url\\({w}({string}|{urlchar}*){w}\\)"
		},

		// Always test against these patterns
		FUNCTION: {
			leading: "", 
			all: true,
			pattern: "{ident}([:\\.]{ident})*\\("
		},  // URI lands in here
		IDENT: {
			leading: "-",
			all: true,
			pattern: "{ident}"
		},
		CHAR: {
			leading: "",
			all: true,
			pattern: "[^'\"]"
		},  // Matches nearly anything - must be near the end
		UNMATCHED: {
			leading: "",
			all: true,
			pattern: "."
		},  // Must be last, shouldn't be hit with valid CSS
	};

	for (var t in tokens) {
		expansion[t] = tokens[t].pattern;
	}

	// Expand all RegExp strings, set initial count
	for (var t in tokens) {
		tokens[t].regexp = expandPatternToRegExp(tokens[t].pattern, expansion);
		tokens[t].count = 0;
	}

	return tokens;
};

var getDefsByLetter = function (tokens) {
	var out = {};
	var all = {};

	for (var tIndex in tokens) {
		var token = tokens[tIndex];
		var letters = token.leading.split('');

		for (var j = 0; j < letters.length; j ++) {
			var letter = letters[j];

			if (! out[letter]) {
				out[letter] = {};
			}
		
			if (! out[letter][tIndex]) {
				out[letter][tIndex] = token;
			}
		}

		if (token.all) {
			all[tIndex] = token;
		}
	}

	for (var letter in out) {
		for (var token in all) {
			out[letter][token] = all[token];
		}
	}

	out[''] = all;

	return out;
};

var defs = getTokenDefs();
var defsByLetter = getDefsByLetter(defs);

var Tokenizer = function (options) {
	this.options = util.setOptions(options);
	this.tokenIndex = 0;
	this.tokens = [];
};

Tokenizer.prototype.anyLeft = function () {
	if (this.tokenIndex < this.tokens.length) {
		return true;
	}

	return false;
};

Tokenizer.prototype.getToken = function () {
	if (this.tokens[this.tokenIndex]) {
		return this.tokens[this.tokenIndex];
	}

	return null;
};

Tokenizer.prototype.next = function () {
	this.tokenIndex ++;
	return this;
};

Tokenizer.prototype.nextToken = function () {
	this.tokenIndex ++;
	return this.getToken();
};

Tokenizer.prototype.tokenCounts = function () {
	var out = {};

	for (var i in defs) {
		out[i] = defs[i].count;
	}

	return out;
};

Tokenizer.prototype.tokenize = function (str) {
	var match = '';
	var lineNumber = 1;
	var wsAtEnd = new RegExp(wsPatternString + '+$');
	var wsAtStart = new RegExp("^" + wsPatternString + "+");

	matches = str.match(wsAtStart);
	
	if (matches) {
		str = str.substr(matches[0].length);
		defs.S.count ++;
		this.tokens.push({
			"line": lineNumber,
			"type": "S",
			"content": matches[0]
		});
		lineNumber += countNewlines(matches[0]);
	}

	while (str.length) {
		// Blank out the info
		var type = null;
		var match = '';
		var defsToMatch = defsByLetter[''];
		var firstLetter = str.charAt(0);

		if (defsByLetter[firstLetter]) {
			defsToMatch = defsByLetter[firstLetter];
		}

		// Find the pattern that matches the best
		for (idx in defsToMatch) {
			if (type === null) {
				var matches = str.match(defsToMatch[idx].regexp);

				if (matches) {
					type = idx;
					match = matches[0];
				}
			}
		}

		str = str.substr(match.length);
		var ws = match.match(wsAtEnd);

		if (ws) {
			ws = ws[0];

			if (match != ws) {
				match = match.replace(wsAtEnd, '');
			} else {
				ws = null;
			}
		}

		defs[type].count ++;
		this.tokens.push({
			"line": lineNumber,
			"type": type,
			"content": match 
		});
		lineNumber += countNewlines(match);

		if (ws) {
			defs.S.count ++;
			this.tokens.push({
				"line": lineNumber,
				"type": "S",
				"content": ws
			});
			lineNumber += countNewlines(ws);
		}
	}
};

Tokenizer.prototype.toString = function () {
	var tokenList = [];

	this.tokens.forEach(function (token) {
		tokenList.push(JSON.stringify(token));
	});

	return "[\n" + tokenList.join(",\n") + "\n]";
};

exports.tokenize = function (str, options) {
	var cr = new Tokenizer(options);
	cr.tokenize(str);
	return cr;
};

exports.tokenizeFile = function (filename, callback, options) {
	options = util.setOptions(options);
	fs.readFile(filename, options.fileEncoding, function (err, data) {
		if (err) {
			callback(err);
		} else {
			cr = new Tokenizer(options);
			cr.tokenize(data);
			callback(err, cr);
		}
	});
};
