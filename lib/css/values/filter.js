/* <filter>
 *
 * Unofficial CSS property that is used by IE
 *
 * One way for IE to set opacity is
 *   filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)
 * That's huge and prone to errors.  It also needs to be quoted like this
 * for IE 8 and 9
 *   TODO:  support this format
 *   filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * Another way that works in IE 5, 6, 7, 8, and 9 as long as the element has
 * the "hasLayout" property (use "zoom:1" or "width:100%" or another trick)
 *   filter: alpha(opacity=40)
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 * 
 * Other filter values:
 *   filter: none
 *   -ms-filter: none
 *
 * A common problem is to use "opacity:40" instead of "opacity=40".
 *
 * TODO:  This is not complete.  As features are used, we can add them here.
 * TODO:  Maybe this would be better to split into filter-alpha and
 * filter-dximagetransform and things like that?
 * TODO:  handle opacity=12% and opacity=0.12 and convert
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Filter = base.baseConstructor();

util.extend(Filter.prototype, base.base, {
	name: "filter",

	toString: function () {
		return this.toString(false);
	},

	toStringChangeCase: function (changeCase) {
		var out = '';

		if (!! this.preserveCase) {
			changeCase = false;
		}

		this.list.forEach(function (item) {
			out += item.toStringChangeCase(changeCase);
		});

		return out;
	}
});

var alphaParser = function (filter) {
	filter.add(filter.unparsed.advance());

	// Check for opacity
	if (! filter.unparsed.isContent('opacity')) {
		filter.debug('parse fail - alpha - opacity');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Check for = or :, if : then warn
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('filter-use-equals-instead', token);
		if (filter.bucket.options.autocorrect) {
			var colonToken = token.clone();
			colonToken.type = 'MATCH';
			colonToken.content = '=';
			filter.add(colonToken);
		} else {
			filter.add(token);
		}
	} else {
		filter.debug('parse fail - alpha - equals');
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket['number'].parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		filter.debug('parse fail - alpha - number');
		return null;
	}

	filter.warnIfNotInteger(number.firstToken(), number.getValue());
	filter.warnIfOutsideRange(number.firstToken(), 0, 100, number.getValue());
	filter.add(number);
	filter.unparsed = number.unparsed;

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		filter.debug('parse fail - alpha - paren close');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
};

var progidParser = function (filter) {
	var addToken = filter.unparsed.advance();
	addToken.content = addToken.content.toLowerCase();
	filter.add(addToken);
	
	if (! filter.unparsed.isContent(':')) {
		filter.debug('parse fail - progid - colon');
		return null;
	}

	filter.add(filter.unparsed.advance());

	//if (! filter.unparsed.isContent('DXImageTransform.Microsoft.Alpha(')) {
	if (! filter.unparsed.isContent('dximagetransform.microsoft.alpha(')) {
		filter.debug('parse fail - progid - DX');
		return null;
	}

	addToken = filter.unparsed.advance();
	
	if (addToken.content != 'DXImageTransform.Microsoft.Alpha(') {
		filter.addWarning('filter-case-sensitive', addToken);
		addToken = addToken.clone();
		addToken.content = 'DXImageTransform.Microsoft.Alpha(';
	}

	filter.add(addToken);

	if (! filter.unparsed.isContent('opacity')) {
		filter.debug('parse fail - progid - opacity');
		return null;
	}

	addToken = filter.unparsed.advance();
	addToken.content = addToken.content.toLowerCase();
	filter.add(addToken);

	// Check for = or :, if : then warn
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('filter-use-equals-instead', token);
		token.content = '=';
		filter.add(token);
	} else {
		filter.debug('parse fail - progid - equals');
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket.number.parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		filter.debug('parse fail - progid - number');
		return null;
	}

	filter.warnIfNotInteger(number.firstToken(), number.getValue());
	filter.warnIfOutsideRange(number.firstToken(), 0, 100, number.getValue());
	filter.add(number);
	filter.unparsed = number.unparsed;

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		filter.debug('parse fail - progid - paren close');
		return null;
	}

	filter.add(filter.unparsed.advance());
	filter.preserveCase = true;

	// Add warning - should use alpha(opacity=25)
	filter.addWarning('suggest-using:alpha(...)', filter.firstToken());

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
};

exports.parse = function (unparsedReal, bucket, container) {
	var filter = new Filter(bucket, container, unparsedReal);
	filter.debug('parse', unparsedReal);
	var filterCount = 0;

	if (filter.unparsed.isContent('none')) {
		filter.debug('parse success - none');
		filter.add(filter.unparsed.advance());
		return filter;
	}

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

		filterCount ++;
	}

	if (! filterCount) {
		filter.debug('parse fail - no values');
		return null;
	}

	filter.debug('parse success');
	return filter;
};
