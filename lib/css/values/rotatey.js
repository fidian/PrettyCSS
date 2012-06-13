/* <rotatey>
 *
 * rotatey( WS? <angle> WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "rotatey"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	v.preserveCase = true;

	if (! v.functionParser('rotateY(',
			[ bucket['angle'] ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
