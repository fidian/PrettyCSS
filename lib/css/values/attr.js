/* <attr>
 *
 * attr( WS? IDENT WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Attr = base.baseConstructor();

util.extend(Attr.prototype, base.base, {
	name: "attr"
});


exports.parse = function (unparsedReal, bucket, container) {
	var attr = new Attr(bucket, container, unparsedReal);
	attr.debug('parse', attr.unparsed);

	if (! attr.functionParser('attr(', bucket['ident'])) {
		attr.debug('parse fail');
		return null;
	}

	attr.debug('parse success');
	return attr;
};
