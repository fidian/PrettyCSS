var base = require('./base');
var util = require('../util');

var RuleComment = base.baseConstructor();

util.extend(RuleComment.prototype, base.base, {
	name: 'rule-comment',
	
	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('rulecomment', this.list);
	}
});

exports.canStartWith = function (token) {
	return false;  // Should not be used by stylesheet parser
};

exports.parse = function (tokens, parser, container) {
	var comment = new RuleComment(parser, container);
	comment.debug('parse', tokens);
	comment.add(tokens.getToken());
	tokens.next();
	return comment;
};
