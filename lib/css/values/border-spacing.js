/* <border-spacing>
 *
 * CSS2:  <length> <length>? | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderSpacing = base.baseConstructor();

util.extend(BorderSpacing.prototype, base.base, {
	name: "border-spacing"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BorderSpacing(bucket, container, unparsedReal);
	bs.debug('parse', unparsedReal);

	if (bs.handleInherit()) {
		return bs;
	}

	var hits = bs.repeatParser([ bucket['length'] ], 2);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.warnIfInherit();
	return bs;
};
