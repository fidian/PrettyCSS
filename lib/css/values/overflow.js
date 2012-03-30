/* <font-family>
 *
 * CSS1:  [ [ <font-family-name> | <font-family-generic-name> ] , ]* [ <font-family-name> | <font-family-generic-name> ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var overflowDimension = require('./overflow-dimension');
var util = require('../../util');
var validate = require('./validate');

var Overflow = base.baseConstructor();

util.extend(Overflow.prototype, base.base, {
	name: "overflow"
});

exports.parse = function (unparsedReal, parser, container) {
	var overflow = new Overflow(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	overflow.debug('parse', unparsedReal);

	if (overflow.handleInherit()) {
		return overflow;
	}

	// Check for CSS2 definition
	// Don't use overflowDimension here since that will add a
	// CSS3 warning automatically
	var result = unparsed.matchAny([ 'visible', 'hidden', 'scroll', 'auto' ], overflow);
	if (result && ! result.unparsed.firstToken()) {
		// No more tokens, so this is CSS 2
		overflow.add(result);
		overflow.unparsed = result.unparsed;
		validate.call(overflow, 'minimumCss', overflow.firstToken(), 2);
		return overflow;
	}

	// Tokens were left over, so this could be CSS3.
	// Start again with a new copy of the unparsed tokens.
	unparsed = unparsedReal.clone();
	result = overflowDimension.parse(unparsed, parser, overflow);
	
	if (! result) {
		return null;
	}

	// The CSS3 warning is added automatically by overflowDimension
	overflow.add(result);
	unparsed = result.unparsed;
	result = overflowDimension.parse(unparsed, parser, overflow);

	if (result) {
		overflow.add(result);
		unparsed = result.unparsed;
	}

	overflow.warnIfInherit();
	overflow.unparsed = unparsed;
	return overflow;
};
