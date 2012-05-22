/* <translate>
 *
 * translate( WS? <translation-value> WS? ( COMMA WS? <translation-value> WS? )? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "translate"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('translate(',
			[ bucket['length'], bucket['percentage'] ])) {
		if (! v.functionParser('translate(',
			[ bucket['length'], bucket['percentage'] ],
			[ bucket['length'], bucket['percentage'] ])) {
			v.debug('parse fail');
			return null;
		}
	}

	v.debug('parse success');
	return v;
};
