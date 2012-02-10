exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addPreAndPost: function (type, data) {
		var out = data;
		var opt = this.parser.options;

		if (typeof data == 'object' && data instanceof Array) {
			out = "";
			data.forEach(function (elem) {
				if (elem.content) {
					// A token object
					out += elem.content;
				} else {
					// One of these CSS objects
					out += elem.toString();
				}
			});
		}

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
				message += "[" + outArr.join(" ") + "]";
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

	reindent: function (str) {
		var indent = "",
			ref = this.container;

		if (! ref) {
			return str;
		}

		while (ref.container) {
			indent += this.parser.options.indent;
			ref = ref.container;
		}

		return str.replace(/\n/g, indent);
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

