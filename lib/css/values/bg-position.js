/* <bg-position>
 *
 * This one is a bit more complex, so I'm just listing all possible
 * combinations, along with CSS versions.  There's a few abbreviations:
 *    C = center
 *    TB = top | bottom
 *    LR = left | right
 *    PL = <percent> | <length>
 *
 *  CSS  Format
 * ----- -----------
 * 2     inherit
 * 1     C
 * 1     C  C
 * 1-2.1 C  LR
 * 3     C  LR PL
 * 1     C  TB
 * 3     C  TB PL
 * 2.1   C  PL
 * 1     LR
 * 1     LR C
 * 1     LR TB
 * 2.1   LR PL
 * 1     TB
 * 1-2.1 TB C
 * 1-2.1 TB LR
 * 3     TB PL C
 * 3     TB PL LR PL
 * 1     PL
 * 2.1   PL C
 * 2.1   PL TB
 * 1     PL PL
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgPosition = base.baseConstructor();

util.extend(BgPosition.prototype, base.base, {
	name: "bg-position",
	patterns: {
		"inherit": {
			minimumCss: 2,
			allowInherit: true
		},
		"C": {
			children: {
				"C": {
				},
				"LR": {
					maximumCss: 2.1,
					notForwardCompatible: 3,
					autocorrectSwap: true,
					children: {
						"PL": {
							minimumCss: 3
						}
					}
				},
				"TB": {
					children: {
						"PL": {
							minimumCss: 3
						}
					}
				},
				"PL": {
					minimumCss: 2.1
				}
			}
		},
		"LR": {
			children: {
				"C": {
				},
				"TB": {
				},
				"PL": {
					minimumCss: 2.1
				}
			}
		},
		"TB": {
			children: {
				"C": {
					maximumCss: 2.1,
					autocorrectSwap: true,
					notForwardCompatible: 3
				},
				"LR": {
					maximumCss: 2.1,
					autocorrectSwap: true,
					notForwardCompatible: 3
				},
				"PL": {
					isValid: false,
					children: {
						"C": {
							minimumCss: 3
						},
						"LR": {
							isValid: false,
							children: {
								"PL": {
									minimumCss: 3
								}
							}
						}
					}
				}
			}
		},
		"PL": {
			children: {
				"C": {
					minimumCss: 2.1
				},
				"TB": {
					minimumCss: 2.1
				},
				"PL": {
				}
			}
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

			case 'TB':
				if (unparsed.isContent([ 'top', 'bottom' ])) {
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

	// isValid: boolean -- If present, must be true or must use a child
	if (typeof childDef.isValid != 'undefined' && ! childDef.isValid) {
		bp.debug('parse fail - not valid');
		return null;
	}

	var didAutocorrect = false;

	// autocorrectSwap: boolean -- If present and true, swap the last two
	// tokens to avoid the "notForwardCompatible" warning
	if (childDef.autocorrectSwap && bucket.options.autocorrect) {
		var aa = bp.list.pop();
		var bb = bp.list.pop();
		bp.add(aa);
		bp.add(bb);
		bp.addWarning('autocorrect-swap', aa);
		didAutocorrect = true;
	}

	// minimumCss: X -- validate if present
	if (childDef.minimumCss && ! didAutocorrect) {
		validate.call(bp, 'minimumCss', bp.firstToken(), childDef.minimumCss);
	}

	// maximumCss: Y -- validate if present
	if (childDef.maximumCss && ! didAutocorrect) {
		validate.call(bp, 'maximumCss', bp.firstToken(), childDef.maximumCss);
	}

	// notForwardCompatible: Z -- validate if present
	if (childDef.notForwardCompatible && ! didAutocorrect) {
		validate.call(bp, 'notForwardCompatible', bp.firstToken(), childDef.notForwardCompatible);
	}

	// allowInherit: boolean -- "inherit" is bad unless this is set and true
	if (! childDef.allowInherit) {
		bp.warnIfInherit();
	}

	bp.unparsed = childDef.unparsed;
	bp.debug('parse success', bp.unparsed);
	return bp;
};
