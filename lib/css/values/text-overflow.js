/* <text-overflow>
 *
 * CSS3:  inherit | [ clip | ellipsis | <string> ]{1,2}
 *
 * TODO:  If text-overflow or -o-text-overflow is used and the other isn't
 * set, suggest to use both.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextOverflow = base.baseConstructor();

util.extend(TextOverflow.prototype, base.base, {
	name: "text-overflow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var to = new TextOverflow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	to.debug('parse', unparsedReal);
	validate.call(to, 'minimumCss', to.firstToken(), 3);

	if (to.handleInherit(function () {})) {
		return to;
	}

	var result = unparsed.matchAny([ 'clip', 'ellipsis', bucket['string'] ], to);

	if (! result) {
		to.debug('parse fail');
		return null;
	}

	to.add(result);
	unparsed = result.unparsed;
	result = unparsed.matchAny([ 'clip', 'ellipsis', bucket['string'] ], to);

	if (result) {
		to.add(result);
		unparsed = result.unparsed;
	}

	to.unparsed = unparsed;
	to.warnIfInherit();
	return to;
};
