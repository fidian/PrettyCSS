/* <rotate3d>
 *
 * rotate3d( ( WS? <number> WS? COMMA ){3} WS? <angle> WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "rotate3d"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('rotate3d(',
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['angle'] ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
