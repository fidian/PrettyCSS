/* <text-shadow>
 *
 * CSS3:  inherit | none | <text-shadow-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextShadow = base.baseConstructor();

util.extend(TextShadow.prototype, base.base, {
	name: "text-shadow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var ts = new TextShadow(bucket, container, unparsedReal);
	ts.debug('parse', unparsedReal);
	validate.call(ts, 'minimumCss', ts.firstToken(), 3);

	if (ts.handleInherit(function () {})) {
		return ts;
	}

	if (ts.unparsed.isContent('none')) {
		ts.add(ts.unparsed.advance());
		return ts;
	}

	ts.repeatWithCommas = true;

	if (! ts.repeatParser([ bucket['text-shadow-single'] ])) {
		return null;
	}

	ts.warnIfInherit();
	return ts;
};
