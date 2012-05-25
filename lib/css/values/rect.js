/* <rect>
 *
 * rect( WS? [ <length> | auto ] ( WS? COMMA WS? [ <length> | auto ] ){3} WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "rect"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('rect(',
			[ bucket['length'], 'auto' ],
			[ bucket['length'], 'auto' ],
			[ bucket['length'], 'auto' ],
			[ bucket['length'], 'auto' ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
