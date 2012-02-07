var base = require('./base');

var Block = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "block",
	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('block', this.list);
	}
});

exports.canStartWith = function (token) {
	return false;  // Should not be used by token scanners
};

exports.parse = function (tokens, parser) {
	var block = new Block(parser);
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
