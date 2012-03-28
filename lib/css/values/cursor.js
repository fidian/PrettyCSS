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
	var minimumCss = 2;

	if (cursor.handleInherit()) {
		return cursor;
	}

	var uri = url.parse(cursor.unparsed, parser, cursor);

	while (uri) {
		cursor.add(uri);
		cursor.unparsed = uri.unparsed;

		var x = number.parse(cursor.unparsed, parser, cursor);

		if (x) {
			var y = number.parse(x.unparsed, parser, cursor);
			
			if (! y) {
				cursor.debug('parse fail - found X but no Y');
				return null;
			}

			cursor.add(x);
			cursor.add(y);
			cursor.unparsed = y.unparsed;
			minimumCss = 3;
		}

		if (! cursor.unparsed.isType('COMMA')) {
			cursor.debug('parse fail - found URI but no comma');
			return null;
		}

		cursor.add(cursor.unparsed.advance());
		uri = uri.parse(cursor.unparsed, parser, cursor);
	}

	var keyword = cursorKeyword.parse(cursor.unparsed, parser, cursor);

	if (! keyword) {
		cursor.debug('parse fail - no cursor keyword');
		return null;
	}

	validate.call(cursor, 'minimumCss', minimumCss);
	cursor.unparsed = keyword.unparsed;
	cursor.warnIfInherit();
	cursor.debug('parse success', cursor.unparsed);
	return cursor;
};
