/* <filter>
 *
 * Unofficial CSS property that is used by IE
 *
 * One way for IE to set opacity is
 *   filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)
 * That's huge and prone to errors.  It also needs to be quoted like this
 * for IE 8 and 9
 *   filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * Another way that works in IE 5, 6, 7, 8, and 9 as long as the element has
 * the "hasLayout" property (use "zoom:1" or "width:100%" or another trick)
 *   filter: alpha(opacity=40)
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 *
 * A common problem is to use "opacity:40" instead of "opacity=40".
 *
 * TODO:  This is not complete.  As features are used, we can add them here.
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
	if (! filter.unparsed.isContent('opacity')) {
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Check for = or :, if : then warn
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('use_equals_instead', token);
		filter.add(token);
	} else {
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket['number'].parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		return null;
	}

	filter.warnIfNotInteger(number.getFirstToken(), number.getValue());
	filter.warnIfOutsideRange(number.getFirstToken(), 0, 100, number.getValue());

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		return null;
	}

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
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
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('use_equals_instead', token);
		filter.add(token);
	} else {
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket.number.parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		return null;
	}

	filter.warnIfNotInteger(number.getFirstToken(), number.getValue());
	filter.warnIfOutsideRange(number.getFirstToken(), 0, 100, number.getValue());

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		return null;
	}

	// Add warning - should use alpha(opacity=25)
	filter.addWarning('should_use_alpha', filter.getFirstToken());

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
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
