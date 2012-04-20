/* font-face-swash
 *
 * swash( WS? <feature-value-name> WS? )
 *
 * feature-value-name is <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-swash"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('swash(', bucket['font-family-single'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};
