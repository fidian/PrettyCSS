var base = require('./base');

var Comment = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: 'comment',
	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('comment', this.list);
	}
});

exports.canStartWith = function (token) {
	return token.type == 'COMMENT';
};

exports.parse = function (tokens, parser) {
	var comment = new Comment(parser, 'comment');
	comment.debug('parse', tokens);
	comment.add(tokens.getToken());
	tokens.next();
	return comment;
};
