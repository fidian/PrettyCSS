/* <overflow>
 *
 * CSS2:  visible | hidden | scroll | auto | inherit
 * CSS3:  <overflow-dimension>{1,2}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Overflow = base.baseConstructor();

util.extend(Overflow.prototype, base.base, {
	name: "overflow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var overflow = new Overflow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	overflow.debug('parse', unparsedReal);

	if (overflow.handleInherit()) {
		return overflow;
	}

	// Check for CSS2 definition
	// Don't use overflowDimension here since that will add a
	// CSS3 warning automatically
	var result = unparsed.matchAny([ 'visible', 'hidden', 'scroll', 'auto' ], overflow);

	if (result) {
		overflow.add(result);
		overflow.unparsed = result.unparsed;
		validate.call(overflow, 'minimumCss', overflow.firstToken(), 2);

		if (! result.unparsed.firstToken()) {
			// No more tokens, so this is CSS 2
			return overflow;
		}
	} else {
		overflow = null;
	}

	// Tokens were left over, so this could be CSS3.
	// Start again with a new copy of the unparsed tokens.
	var overflow3 = new Overflow(bucket, container, unparsedReal);
	unparsed = unparsedReal.clone();
	result = bucket['overflow-dimension'].parse(unparsed, bucket, overflow3);
	
	if (! result) {
		return overflow;
	}

	// The CSS3 warning is added automatically by overflowDimension
	overflow3.add(result);
	unparsed = result.unparsed;
	result = bucket['overflow-dimension'].parse(unparsed, bucket, overflow3);

	if (result) {
		overflow3.add(result);
		unparsed = result.unparsed;
	}

	overflow3.unparsed = unparsed;
	overflow3.warnIfInherit();

	if (overflow && overflow.unparsed.length() == overflow3.unparsed.length()) {
		return overflow;
	}

	return overflow3;
};
