/* <font-face-local>
 *
 * local( WS? IDENT [ WS? IDENT ]* WS? )
 * local( WS? STRING WS? )
 *
 * The contents of the local() function are identical to <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-local"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('local(', [ bucket['font-family-single'] ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
