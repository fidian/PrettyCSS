"use strict";
require('./shim');
var cssBucket = require('./cssbucket');
var tokenizer = require('./tokenizer');
var util = require('./util');

var PrettyCSS = function (options) {
	this.options = util.setOptions(options);
	this.errors = [];
	this.warnings = [];
	this.stylesheet = null;
};

util.extend(PrettyCSS.prototype, {
	addError: function (code, token) {
		this.errors.push({
			"code": code,
			"token": token
		});
	},

	addWarning: function (code, token) {
		this.warnings.push({
			"code": code,
			"token": token
		});
	},

	debug: function (message) {
		if (! this.options.debug) {
			return;
		}

		console.log(message);
	},

	parse: function (tokens) {
		cssBucket.parser = this;
		cssBucket.options = this.options;
		cssBucket.tokenizer = tokenizer;
		this.stylesheet = cssBucket.stylesheet.parse(tokens, cssBucket, this);
	},

	toString: function () {
		var out = "";

		if (this.stylesheet) {
			out = this.stylesheet.toString();
			out = out.replace(/^[\s\r\n]+/, '').replace(/[\s\r\n]+$/, '');
		}

		return out;
	}
});

exports.parse = function (str, options) {
	var p = new PrettyCSS(options);
	var t = tokenizer.tokenize(str, options);
	p.parse(t);
	return p;
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
