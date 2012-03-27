/* <text-overflow>
 *
 * CSS3:  inherit | [ clip | ellipsis | <string> ]{1,2}
 *
 * TODO:  If text-overflow or -o-text-overflow is used and the other isn't
 * set, suggest to use both.
 */

"use strict";

var base = require('./base');
var str = require('./string');
var util = require('../../util');
var validate = require('./validate');

var TextOverflow = base.baseConstructor();

util.extend(TextOverflow.prototype, base.base, {
	name: "text-overflow"
});

exports.parse = function (unparsedReal, parser, container) {
	var to = new TextOverflow(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	to.debug('parse', unparsedReal);
	validate.call(to, 'minimumCss', 3);

	if (unparsed.isContent('inherit')) {
		to.add(unparsed.advance());
		to.unparsed = unparsed;
		return to;
	}

	var result = unparsed.matchAny([ 'clip', 'ellipsis', str ], to);

	if (! result) {
		to.debug('parse fail');
		return null;
	}

	to.add(result);
	unparsed = result.unparsed;
	result = unparsed.matchAny([ 'clip', 'ellipsis', str ], to);

	if (result) {
		to.add(result);
		unparsed = result.unparsed;
	}

	to.unparsed = unparsed;
	to.warnIfInherit();
	return to;
};
