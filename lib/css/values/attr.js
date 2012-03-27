/* <attr>
 *
 * attr( WS? IDENT WS? )
 */

"use strict";

var base = require('./base');
var ident = require('./ident');
var util = require('../../util');

var Attr = base.baseConstructor();

util.extend(Attr.prototype, base.base, {
	name: "attr"
});


exports.parse = function (unparsedReal, parser, container) {
	var attr = new Attr(parser, container, unparsedReal);
	attr.debug('parse', attr.unparsed);

	if (! attr.functionParser('attr(', ident)) {
		attr.debug('parse fail');
		return null;
	}

	attr.debug('parse success');
	return attr;
};
