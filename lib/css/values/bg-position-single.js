/* <bg-position-single>
 *
 * These are all the possible combinations, along with CSS versions.
 * There's a few abbreviations:
 *    C = center
 *    LR = left | right
 *    PL = <percent> | <length>
 *
 *  CSS  Format
 * ----- -----------
 * 2     inherit
 * 1     C
 * 1     LR
 * 1     PL
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgPosition = base.baseConstructor();

util.extend(BgPosition.prototype, base.base, {
	name: "bg-position-single",
	patterns: {
		"inherit": {
			minimumCss: 2,
			allowInherit: true
		},
		"C": {
		},
		"LR": {
		},
		"PL": {
		}
	}
});


var testPatterns = function (patterns, unparsedReal, bucket, container) {
	var unparsed = unparsedReal.clone();

	for (var pm in patterns) {
		var doesMatch = false;
		var token = null;

		switch (pm) {
			case 'inherit':
				if (unparsed.isContent('inherit')) {
					doesMatch = true;
				}

				break;

			case 'C':
				if (unparsed.isContent('center')) {
					doesMatch = true;
				}

				break;

			case 'LR':
				if (unparsed.isContent([ 'left', 'right' ])) {
					doesMatch = true;
				}

				break;

			case 'PL':
				token = unparsed.matchAny([ bucket['percentage'], bucket['length'] ], container);

				if (token) {
					doesMatch = true;
				}

				break;

			default:
				throw new Error('Unknown pattern matching definition: ' + pm);
		}

		if (doesMatch) {
			if (token === null) {
				token = unparsed.advance();
			} else {
				unparsed = token.unparsed;
			}

			if (patterns[pm].children) {
				var tryChild = testPatterns(patterns[pm].children, unparsed, bucket, container);

				if (tryChild) {
					tryChild.tokens.unshift(token);
					return tryChild;
				}
			}

			return util.extend({}, patterns[pm], {
				tokens: [ token ],
				unparsed: unparsed
			});
		}
	}

	return null;
};


exports.parse = function (unparsedReal, bucket, container) {
	var bp = new BgPosition(bucket, container, unparsedReal);
	bp.debug('parse', unparsedReal);

	var childDef = testPatterns(bp.patterns, unparsedReal, bucket, bp);

	if (! childDef) {
		bp.debug('parse fail - testPatterns');
		return null;
	}

	childDef.tokens.forEach(function (token) {
		bp.add(token);
	});

	// minimumCss: X -- validate if present
	if (childDef.minimumCss) {
		validate.call(bp, 'minimumCss', bp.firstToken(), childDef.minimumCss);
	}

	// allowInherit: boolean -- "inherit" is bad unless this is set and true
	if (! childDef.allowInherit) {
		bp.warnIfInherit();
	}

	bp.unparsed = childDef.unparsed;
	bp.debug('parse success', bp.unparsed);
	return bp;
};
