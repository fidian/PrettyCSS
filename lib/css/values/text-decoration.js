/* <text-decoration>
 *
 * --- handled by text-decoration-css2
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 *
 * --- handled by text-decoration-css3
 * CSS3:  <text-decoration-line> || <text-decoration-style> || <text-decoration-color> || blink
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecoration = base.baseConstructor();

util.extend(TextDecoration.prototype, base.base, {
	name: "text-decoration",

	allowed: [
		{
			validation: [],
			valueObjects: [
				'text-decoration-css2',
				'text-decoration-css3'
			]
		}
	]
});

exports.parse = function (unparsedReal, bucket, container) {
	var td = new TextDecoration(bucket, container, unparsedReal);
	td.debug('parse', unparsedReal);
	var tdc2 = bucket['text-decoration-css2'].parse(unparsedReal, bucket, td);
	
	if (tdc2 && ! tdc2.unparsed.length()) {
		td.add(tdc2);
		td.unparsed = tdc2.unparsed;
		return td;
	}

	var tdc3 = bucket['text-decoration-css3'].parse(unparsedReal, bucket, td);

	if (tdc3) {
		td.add(tdc3);
		td.unparsed = tdc3.unparsed;
	} else if (tdc2) {
		td.add(tdc2);
		td.unparsed = tdc2.unparsed;
	} else {
		return null;
	}

	return td;
};
