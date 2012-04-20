/* font-face-styleset
 *
 * styleset( WS? <feature-value-name> WS? [ COMMA WS? <feature-value-name WS? ]* )
 *
 * feature-value-name is <font-family-single>
 * With commas, this looks like styleset(<font-family>)
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-styleset"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('styleset(', bucket['font-family'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};
