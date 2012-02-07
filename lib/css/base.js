function Base(parser) {
	if (! parser) {
		throw new Error("Invalid parser");
	}

	this.parser = parser;
	this.list = [];
};

Base.prototype.add = function (t) {
	this.list.push(t);
};

Base.prototype.addPreAndPost = function (type, data) {
	var out = data;

	if (typeof data == 'object' && data instanceof Array) {
		out = "";
		data.forEach(function (elem) {
			if (typeof elem == 'object' && elem instanceof Base) {
				// One of these CSS objects
				out += elem.toString();
			} else {
				// A token object
				out += elem.content;
			}
		});
	}

	return this.parser.options[type + '_pre'] + out + this.parser.options[type + '_post'];
};

Base.prototype.toString = function () {
	throw new Error("Did not override toString() of base class");
};

Base.prototype.debug = function (message, info) {
	if (! this.parser.options.debug) {
		return;
	}

	message = "[" + this.name + "] " + message;

	if (typeof info == "object") {
		if (typeof info.getToken == "function") {
			message += "\n" + JSON.stringify(info.getToken());
		} else {
			message += "\n" + JSON.stringify(info);
		}
	} else if (typeof info != "undefined") {
		message += "\nUnknown type: " + typeof info;
	}

	this.parser.debug(message);
};

exports.base = Base;
exports.unexpectedToken = function (wanted, actual) {
	throw new Error(wanted + " - found " + JSON.stringify(actual));
};

