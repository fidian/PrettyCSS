"use strict";

var base = require('./base');
var util = require('../util');

var Comment = base.baseConstructor();

util.extend(Comment.prototype, base.base, {
	name: 'comment',
	
	toString: function () {
		this.debug('toString', this.list);

		if (this.container.name == "stylesheet") {
			return this.addWhitespace('topcomment', this.list);
		}

		return this.addWhitespace('comment', this.list);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'COMMENT';
};

exports.parse = function (tokens, bucket, container) {
	var comment = new Comment(bucket, container);
	comment.debug('parse', tokens);
	comment.add(tokens.getToken());
	tokens.next();
	return comment;
};
