/* background-size
 *
 * CSS3:  <bg-size>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundSize = base.baseConstructor();

util.extend(BackgroundSize.prototype, base.base, {
	name: "background-size"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BackgroundSize(bucket, container, unparsedReal);
	bs.debug('parse', unparsedReal);
	
	if (bs.handleInherit()) {
		return bs;
	}

	bs.repeatWithCommas = true;
	var hits = bs.repeatParser(bucket['bg-size']);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.warnIfInherit();
	bs.debug('parse success', bs.unparsed);
	return bs;
};
