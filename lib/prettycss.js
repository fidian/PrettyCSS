var tokenizer = require('./tokenizer.js');
var util = require('./util');

var PrettyCSS = function (options) {
	this.options = util.setOptions(options);
	this.warnings = [];
	this.rules = [];
};

prettyCss.prototype.parse = function (tokens) {
	while (tokens.anyLeft()) {
		var t = tokens.getNextToken();
		switch (t.type) {
			default:
				console.log('Unhandled type: ' + t.type);
				return;
		}
	}
};

prettyCss.prototype.parse = function (str) {
	var tokens = tokenizer.tokenize(str, this.options);
	var parsed = this.parseTokens(tokens);
};

exports.parseString = function (str, options) {
	var p = new PrettyCSS(options);
	var t = tokenizer.tokenize(str);
	return p.parse(t);
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
