/* cursor
 *
 * CSS2:  inherit | [ <uri> , ]* <cursor-keyword>
 * CSS3:  inherit | [ <uri> [ <x> <y> ] , ]* <cursor-keyword>
 */

"use strict";

var base = require('./base');
var cursorKeyword = require('./cursor-keyword');
var number = require('./number');
var url = require('./url');
var util = require('../../util');
var validate = require('./validate');

var Cursor = base.baseConstructor();

util.extend(Cursor.prototype, base.base, {
	name: "cursor"
});


exports.parse = function (unparsedReal, parser, container) {
	var cursor = new Cursor(parser, container, unparsedReal);
	cursor.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();

	if (unparsed.isContent('inherit')) {
		cursor.add(unparsed.advance());
		cursor.unparsed = unparsed;
		return cursor;
	}

	var uri = url.parse(unparsed, parser, cursor);

	while (uri) {
		cursor.add(uri);
		unparsed = uri.unparsed;

		var x = number.parse(unparsed, parser, cursor);

		if (x) {
			var y = number.parse(x.unparsed, parser, cursor);
			
			if (! y) {
				cursor.debug('parse fail - found X but no Y');
				return null;
			}

			cursor.add(x);
			cursor.add(y);
			unparsed = y.unparsed;
		}

		if (! unparsed.isType('COMMA')) {
			cursor.debug('parse fail - found URI but no comma');
			return null;
		}

		unparsed.advance();
		uri = uri.parse(unparsed, parser, cursor);
	}

	var keyword = cursorKeyword.parse(unparsed, parser, cursor);

	if (! keyword) {
		cursor.debug('parse fail - no cursor keyword');
		return null;
	}

	cursor.warnIfInherit();
	cursor.unparsed = unparsed;
	cursor.debug('parse success', cursor.unparsed);
	return cursor;
};
