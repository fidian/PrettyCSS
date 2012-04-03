/* <border-single>
 *
 * CSS1:  <border-width-single> || <border-style> || <border-color-single>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderSingle = base.baseConstructor();

util.extend(BorderSingle.prototype, base.base, {
	name: "border-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BorderSingle(bucket, container, unparsedReal);
	var unparsed = bs.unparsed.clone();
	bs.debug('parse', unparsedReal);

	if (bs.handleInherit()) {
		return bs;
	}

	var hits = unparsed.matchAnyOrder([
		bucket['border-width-single'],
		bucket['border-style'],
		bucket['border-color-single']
	], bs);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.debug('parse success', bs.unparsed);
	bs.warnIfInherit();
	return bs;
};
