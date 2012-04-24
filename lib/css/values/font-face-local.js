/* <font-face-local>
 *
 * local( WS? IDENT [ WS? IDENT ]* WS? )
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
	v.isFunction = true;

	if (! v.unparsed.isTypeContent('FUNCTION', 'local(')) {
		v.debug('parse fail - function');
		return null;
	}

	v.add(v.unparsed.advance());

	var ffs = bucket['font-family-single'].parse(v.unparsed, bucket, v);

	if (! ffs) {
		v.debug('parse fail - font family single');
		return null;
	}

	v.add(ffs);
	v.unparsed = ffs.unparsed;

	if (! v.unparsed.isTypeContent('PAREN_CLOSE', ')')) {
		v.debug('parse fail - paren close');
		return null;
	}

	v.unparsed.advance();

	v.debug('parse success');
	return v;
};
