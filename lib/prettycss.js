var tokenizer = require('./tokenizer.js');

var prettyCss = function (options) {
	this.warnings = [];
};

prettyCss.prototype.parse = function (str) {
	var tokens = tokenizer.tokenize(str);
	var nextToken = tokens.getNextToken();

// LEFT OFF HERE - below code was from before the tokenizer rewrite
	while (nextToken) {
		var tokenStr = nextToken.str.toLowerCase();
		var f = this.parseRuleset;
		if ('@' == tokenStr.substr(0, 1)) {
			f = this.parseAtRule;
		} else if ('<!--' == tokenStr.substr(0, 4)) {
			f = this.parseCdo;
		} else if ('-->' == tokenStr.substr(-3)) {
			f = this.parseCdc;
		} else if ('/*' == tokenStr.substr(0, 2)) {
			f = this.parseComment;
		}
		f(nextToken, tokens);
		nextToken = tokens.getNextToken();
	}
};

exports.parseString = function (str, options) {
	if (! options) {
		options = {};
	}
	var pc = new prettyCss(options);
	pc.parse(str);
	return pc;
}
