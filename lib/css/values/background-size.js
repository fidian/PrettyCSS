/* background-size
 *
 * CSS3:  <bg-size> [, <bg-size>]*
 */

"use strict";

var base = require('./base');
var bgSize = require('./bg-size');
var util = require('../../util');
var validate = require('./validate');

var BackgroundSize = base.baseConstructor();

util.extend(BackgroundSize.prototype, base.base, {
	name: "background-size"
});


exports.parse = function (unparsedReal, parser, container) {
	var bs = new BackgroundSize(parser, container, unparsedReal);
	bs.debug('parse', unparsedReal);
	
	if (bs.handleInherit()) {
		return bs;
	}

	var hits = bs.repeatParser(bgSize);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.warnIfInherit();
	bs.debug('parse success', bs.unparsed);
	return bs;
};
