var base = require('./base');
var util = require('../util');

var Block = base.baseConstructor();

util.extend(Block.prototype, base.base, {
	name: "block",

	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('block', this.list);
	}
});

exports.canStartWith = function (token) {
	return false;  // Should not be used by token scanners
};

exports.parse = function (tokens, parser, container) {
	var block = new Block(parser, container);
	block.debug('parse', tokens);
	var depth = 1;

	while (depth) {
		var token = tokens.nextToken();

		if (token.type == 'BLOCK_OPEN') {
			depth ++;
		} else if (token.type == 'BLOCK_CLOSE') {
			depth --;
		}

		if (depth) {
			block.add(token);
		}
	}

	tokens.next();
	return block;
};
