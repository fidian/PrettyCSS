/* <border-image>
 *
 * CSS3:  inherit || [ <border-image-source> || <border-image-slice> [ / <border-image-width> | / <border-image-width>? / <border-image-outset> ]? || <border-image-repeat> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);
	var foundSource = false;
	var foundSlice = false;
	var foundRepeat = false;
	var keepParsing = true;
	var next = null;

	if (v.handleInherit(function () {})) {
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	while (keepParsing) {
		keepParsing = false;

		if (! foundSource) {
			next = bucket['border-image-source'].parse(v.unparsed, bucket, v);

			if (next) {
				foundSource = true;
				keepParsing = true;
				v.add(next);
				v.unparsed = next.unparsed;
			}
		}

		if (! foundSlice) {
			next = bucket['border-image-slice'].parse(v.unparsed, bucket, v);

			if (next) {
				foundSlice = true;
				keepParsing = true;
				v.add(next);
				v.unparsed = next.unparsed;

				// If there is a slash, then we must match one of the following
				// / <border-image-width>
				// / <border-image-width>? / <border-image-outset>
				if (v.unparsed.isContent('/')) {
					var isOk = false;
					v.add(v.unparsed.advance());
					next = bucket['border-image-width'].parse(v.unparsed, bucket, v);

					if (next) {
						v.add(next);
						v.unparsed = next.unparsed;
						isOk = true;
					}

					if (v.unparsed.isContent('/')) {
						v.add(v.unparsed.advance());
						next = bucket['border-image-outset'].parse(v.unparsed, bucket, v);

						if (next) {
							v.add(next);
							v.unparsed = next.unparsed;
							isOk = true;
						}
					}

					if (! isOk) {
						v.debug('parse fail - invalid slice / width / outset');
						return null;
					}
				}
			}
		}
		
		if (! foundRepeat) {
			next = bucket['border-image-repeat'].parse(v.unparsed, bucket, v);

			if (next) {
				foundRepeat = true;
				keepParsing = true;
				v.add(next);
				v.unparsed = next.unparsed;
			}
		}
	}

	if (! foundSource && ! foundSlice && ! foundRepeat) {
		v.debug('parse fail');
		return null;
	}

	v.warnIfInherit();
	v.debug('parse success', v.unparsed);
	return v;
};
