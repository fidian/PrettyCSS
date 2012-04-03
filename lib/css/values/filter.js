/* <filter>
 *
 * Unofficial CSS property that is used by IE
 *
 * One way for IE to set opacity is
 *   filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)
 * That's huge and prone to errors.  Another way that works in IE 5, 6, 7, 8,
 * and 9 as long as the element has "hasLayout" (use "zoom:1" or "width:100%"
 * or another trick)
 *   filter: alpha(opacity=40)
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 *
 * A common problem is to use "opacity:40" instead of "opacity=40".
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Filter = base.baseConstructor();

util.extend(Filter.prototype, base.base, {
	name: "filter"
});

var alphaParser = function (filter) {
	filter.add(filter.unparsed.advance());

	// Check for opacity

	// Check for = or :, if : then warn

	// Next up is an integer between 0 and 100

	// Next is close parentheis

	// Now return true when this works
	return null;
};

var progidParser = function (filter) {
	filter.add(filter.unparsed.advance());
	
	if (! filter.unparsed.isContent(':')) {
		return null;
	}

	filter.add(filter.unparsed.advance());

	if (! filter.unparsed.isContent('DXImageTransform.Microsoft.Alpha(')) {
		return null;
	}

	filter.add(filter.unparsed.advance());

	if (! filter.unparsed.isContent('opacity')) {
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Check for = or :, if : then warn

	// Next up is an integer between 0 and 100

	// Next is close parentheis

	// Now return true when this works
	return null;
};

exports.parse = function (unparsedReal, bucket, container) {
	var filter = new Filter(bucket, container, unparsedReal);
	filter.debug('parse', unparsedReal);
	validate.call(filter, 'unofficial', filter.unparsed.firstToken());

	while (filter.unparsed.length()) {
		if (filter.unparsed.isContent('progid')) {
			if (! progidParser(filter)) {
				filter.debug('parse fail - progid');
				return null;
			}
		} else if (filter.unparsed.isContent('alpha(')) {
			if (! alphaParser(filter)) {
				filter.debug('parse fail - alpha');
				return null;
			}
		} else {
			filter.debug('parse fail - unsupported content');
			return null;
		}
	}

	filter.debug('parse success');
	return filter;
};
