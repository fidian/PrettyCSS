"use strict";

exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addList: function (l) {
		for (var i in l) {
			this.list.push(l[i]);
		}
	},

	addWhitespace: function (type, data) {
		var opt = this.bucket.options;
		var out = this.makeString(data);
		return opt[type + '_pre'] + out + opt[type + '_post'];
	},

	convertToString: function (token) {
		// Check if it is a token
		if (token.type && token.line) {
			return token.type + "@" + token.line + ":" + JSON.stringify(token.content);
		}

		// It is probably one of our value objects
		// Avoid the "toString" method since that also calls debug
		var out = token.name;

		if (token.list instanceof Array) {
			out += '(' + token.list.length + ')';
		}

		return out;
	},

	debug: function (message, info) {
		if (! this.bucket.options.debug) {
			return;
		}

		// Count depth
		var lead = "";
		var ptr = this.container;

		if (ptr) {
			while (ptr.container) {
				lead += "....";
				ptr = ptr.container;
			}
		}

		message = lead + "[" + this.name + "] " + message;

		if (info !== null && typeof info == "object") {
			if (typeof info.getToken == "function") {
				// Tokenizer object - safe to call toString()
				message += "\n" + JSON.stringify(info.getToken().toString());
			} else if (info instanceof Array) {
				// Array of tokens or CSS objects
				var outArr = [];
				message += "\narray(" + info.length + ")";
				for (var i = 0; i < info.length; i ++) {
					outArr.push(this.convertToString(info[i]));
				}
				message += "\n[" + outArr.join(" ") + "]";
			} else {
				// Single token object or CSS object
				message += "\n" + this.convertToString(info);
			}
		} else if (info === null) {
			message += "\nnull";
		} else if (typeof info != "undefined") {
			message += "\nUnknown type: " + typeof info;
		}

		this.bucket.parser.debug(message);
	},

	init: function () {
		this.container = null;
		this.list = [];
		this.bucket = null;
	},

	makeString: function (data, joiner) {
		if (typeof data != 'object') {
			return data;
		}

		if (typeof joiner == 'undefined') {
			joiner = '';
		}

		var out = "";

		data.forEach(function (elem) {
			out += elem.toString() + joiner;
		});

		return out;
	},

	parseTokenList: [],

	parseTokens: function (tokens) {
		var token = tokens.getToken();
		var myself = this;

		var failed = this.parseTokenList.every(function (typeString) {
			var type = typeString;

			if (myself.bucket[typeString]) {
				type = myself.bucket[typeString];
			}

			if (type.canStartWith(token, tokens, myself.bucket)) {
				myself.add(type.parse(tokens, myself.bucket, myself));

				// Return false - do not keep scanning
				return false;
			}

			// Return true - continue to next type
			return true;
		});

		if (failed) {
			throw new Error("Could not find valid type for token " + token.type);
		}
	},

	reindent: function (str) {
		var indent = this.bucket.options.indent;

		if (! indent) {
			return str;
		}

		str = str.replace(/\n/g, "\n" + indent);

		// At this point, comments with newlines also were reindented.
		// This change should be removed to preserve the comment intact.
		str = str.replace(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//g, function (match) {
			var r = new RegExp("\n" + indent, 'g');
			return match.replace(r, "\n");
		});

		return str;
	},

	setBucket: function (bucket) {
		if (! bucket) {
			throw new Error("Invalid bucket");
		}

		this.bucket = bucket;
	},

	setContainer: function (container) {
		if (! container) {
			throw new Error("Invalid container");
		}

		this.container = container;
	},

	toString: function () {
		throw new Error("Did not override toString() of base class");
	}
};

exports.baseConstructor = function () {
	return function (bucket, container) {
		this.init();
		this.setBucket(bucket);
		this.setContainer(container);
		return this;
	};
};

exports.selectorCanStartWith = function (token, tokens, bucket) {
	switch (token.type) {
		case "ATTRIB":
		case "CLASS":
		case "COLON":
		case "COMBINATOR":
		case 'HASH':
		case 'IDENT':
			return true;

		case 'CHAR':
			if (token.content == '*') {
				return true;
			}

			return false;

		default:
			return false;
	}
};
