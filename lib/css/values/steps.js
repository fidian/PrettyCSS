/* <steps>
 *
 * steps( WS? <number> WS? , WS? [ start | end ] WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "steps"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('steps(',
			[ bucket['number'] ],
			[ 'start', 'end' ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
