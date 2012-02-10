var stylesheet = require('./css/stylesheet.js');
var tokenizer = require('./tokenizer.js');
var util = require('./util');

var PrettyCSS = function (options) {
	this.options = util.setOptions(options);
	this.warnings = [];
	this.rules = [];
};

PrettyCSS.prototype.debug = function (message) {
	if (! this.options.debug) {
		return;
	}

	console.log(message);
};

PrettyCSS.prototype.parse = function (tokens) {
	return stylesheet.parse(tokens, this);
};

exports.parse = function (str, options) {
	var p = new PrettyCSS(options);
	var t = tokenizer.tokenize(str, options);
	var parsed = p.parse(t);
	return parsed;
};

exports.parseFile = function (filename, callback, options) {
	tokenizer.tokenizeFile(filename, function (err, t) {
		if (err) {
			callback(err);
		} else {
			p = new PrettyCSS(options);
			p.parse(t);
			callback(err, p);
		}
	}, options);
};
