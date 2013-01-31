"use strict";
require('./shim');
var cssBucket = require('./cssbucket');
var tokenizer = require('./tokenizer');
var util = require('./util');

var languages = {
	'en-us': require('./lang/en-us.js')
};

var PrettyCSS = function (options) {
	this.options = util.setOptions(options);
	this.errors = [];
	this.warnings = [];
	this.stylesheet = null;
	this.languageSelected = 'en-us';
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
		if (!this.options.debug) {
			return;
		}

		console.log(message);
	},

	getProblems: function () {
		var out = [],
			lang = languages[this.languageSelected];

		function replace(message, spot, withWhat) {
			var parts = message.split(spot);
			return parts.join(withWhat);
		}

		function reformat(type, item) {
			var message,
				code = item.code.match(/^([^:]*)(:(.*))?$/),
				messages = lang[type + 'Messages'],
				replaceSpot = lang.replacementMarker,
				more = null;

			if (!code) {
				throw new Error('Invalid warning/error code: ' + item.code);
			}

			if (code[3]) {
				more = code[3];
			}

			code = code[1];

			if (messages[code]) {
				message = messages[code];
			} else {
				message = lang.noMessageDefined;
				more = item.code;
			}

			if (more) {
				var additional = more;

				if (code.substr(0, 8) == 'browser-') {
					var browserMatch = additional.match(/^([^0-9]+)(.*)$/);

					if (browserMatch && lang.browsers[browserMatch[1]]) {
						additional = lang.browsers[browserMatch[1]] + " " + browserMatch[2];
						additional = additional.replace(/ $/, '');
					}
				}

				message = replace(message, replaceSpot, additional);
			}

			var tokenCopy = null;
			
			if (item.token) {
				tokenCopy = item.token.clone();
			}

			return {
				typeCode: type,
				typeText: lang[type + 'Text'],
				fullCode: item.code,
				code: code,
				more: more,
				token: tokenCopy,
				message: message
			};
		};

		this.errors.forEach(function (item) {
			out.push(reformat('error', item));
		});
		this.warnings.forEach(function (item) {
			out.push(reformat('warning', item));
		});

		return out;
	},

	language: function (newLang) {
		if (! languages[newLang]) {
			throw new Error(newLang + " is not a defined language");
		}

		this.languageSelected = newLang;
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
		var p;

		if (err) {
			callback(err);
		} else {
			p = new PrettyCSS(options);
			p.parse(t);
			callback(err, p);
		}
	}, options);
};
