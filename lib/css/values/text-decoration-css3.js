/* <text-decoration-css3>
 *
 * CSS3:  <text-decoration-css3-line> || <text-decoration-style> || <text-decoration-color> || blink
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss3 = base.baseConstructor();

util.extend(TextDecorationCss3.prototype, base.base, {
	name: "text-decoration-css3"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdc3 = new TextDecorationCss3(bucket, container, unparsedReal);
	var unparsed = tdc3.unparsed.clone();
	tdc3.debug('parse', unparsedReal);
	validate.call(tdc3, 'minimumCss', tdc3.firstToken(), 3);

	var hits = unparsed.matchAnyOrder([
		bucket['text-decoration-css3-line'],
		bucket['text-decoration-style'],
		bucket['text-decoration-color'],
		bucket['text-decoration-blink']
	], tdc3);

	if (! hits) {
		return null;
	}

	return tdc3;
};
