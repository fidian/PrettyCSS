/* <matrix>
 *
 * matrix( WS? <number> ( WS? COMMA WS? <number> ){15} WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "matrix3d"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('matrix3d(',
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ],
			[ bucket['number'] ])) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
