/* <translate3d>
 *
 * translate3d( WS? <translation-value> WS? COMMA WS? <translation-value> WS? COMMA WS? <length> WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "translate3d"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('translate(',
		[ bucket['length'], bucket['percentage'] ],
		[ bucket['length'], bucket['percentage'] ],
		[ bucket['length'] ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
