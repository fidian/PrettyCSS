/* cursor
 *
 * CSS2:  inherit | [ <uri> , ]* <cursor-keyword>
 * CSS3:  inherit | [ <uri> [ <x> <y> ] , ]* <cursor-keyword>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Cursor = base.baseConstructor();

util.extend(Cursor.prototype, base.base, {
	name: "cursor"
});


exports.parse = function (unparsedReal, bucket, container) {
	var cursor = new Cursor(bucket, container, unparsedReal);
	cursor.debug('parse', unparsedReal);
	var minimumCss = 2;

	if (cursor.handleInherit()) {
		return cursor;
	}

	var uri = bucket['url'].parse(cursor.unparsed, bucket, cursor);

	while (uri) {
		cursor.add(uri);
		cursor.unparsed = uri.unparsed;

		var x = bucket['number'].parse(cursor.unparsed, bucket, cursor);

		if (x) {
			var y = bucket['number'].parse(x.unparsed, bucket, cursor);
			
			if (! y) {
				cursor.debug('parse fail - found X but no Y');
				return null;
			}

			cursor.add(x);
			cursor.add(y);
			cursor.unparsed = y.unparsed;
			minimumCss = 3;
		}

		if (! cursor.unparsed.isTypeContent('OPERATOR', ',')) {
			cursor.debug('parse fail - found URI but no comma');
			return null;
		}

		cursor.add(cursor.unparsed.advance());
		uri = bucket['url'].parse(cursor.unparsed, bucket, cursor);
	}

	var keyword = bucket['cursor-keyword'].parse(cursor.unparsed, bucket, cursor);

	if (! keyword) {
		cursor.debug('parse fail - no cursor keyword');
		return null;
	}
	
	cursor.add(keyword);
	validate.call(cursor, 'minimumCss', cursor.firstToken(), minimumCss);
	cursor.unparsed = keyword.unparsed;
	cursor.warnIfInherit();
	cursor.debug('parse success', cursor.unparsed);
	return cursor;
};
