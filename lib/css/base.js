exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addWhitespace: function (type, data) {
		var opt = this.parser.options;
		var out = this.makeString(data);
		return opt[type + '_pre'] + out + opt[type + '_post'];
	},

	debug: function (message, info) {
		if (! this.parser.options.debug) {
			return;
		}

		message = "[" + this.name + "] " + message;

		if (typeof info == "object") {
			if (typeof info.getToken == "function") {
				// Tokenizer object
				message += "\n" + JSON.stringify(info.getToken());
			} else if (info instanceof Array) {
				// Array of tokens
				var outArr = [];
				for (var i = 0; i < info.length; i ++) {
					outArr.push(this.tokenToString(info[i]));
				}
				message += "\n[" + outArr.join(" ") + "]";
			} else {
				// Single token object
				message += "\n" + this.tokenToString(info);
			}
		} else if (typeof info != "undefined") {
			message += "\nUnknown type: " + typeof info;
		}

		this.parser.debug(message);
	},

	init: function () {
		this.container = null;
		this.list = [];
		this.parser = null;
	},

	makeString: function (data, joiner) {
		if (typeof data != 'object') {
			return data;
		}

		var out = "";

		data.forEach(function (elem) {
			out += elem.toString();
		});

		return out;
	},

	parseTokenList: [],

	parseTokens: function (tokens) {
		var token = tokens.getToken();
		var myself = this;

		var failed = this.parseTokenList.every(function (type) {
			if (type.canStartWith(token, tokens, myself)) {
				myself.add(type.parse(tokens, myself.parser, myself));

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
		indent = this.parser.options.indent;

		if (! indent) {
			return str;
		}

		return str.replace(/\n/g, "\n" + indent);
	},

	setContainer: function (container) {
		if (! container) {
			throw new Error("Invalid container");
		}

		this.container = container;
	},

	setParser: function (parser) {
		if (! parser) {
			throw new Error("Invalid parser");
		}

		this.parser = parser;
	},

	tokenToString: function (token) {
		return token.type + "@" + token.line + ":" + JSON.stringify(token.content);
	},

	toString: function () {
		throw new Error("Did not override toString() of base class");
	}
};

exports.baseConstructor = function () {
	return function (parser, container) {
		this.init();
		this.setParser(parser);
		this.setContainer(container);
		return this;
	};
};

exports.unexpectedToken = function (wanted, actual) {
	throw new Error(wanted + " - found " + JSON.stringify(actual));
};

