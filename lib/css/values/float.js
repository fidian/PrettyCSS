/* float
 *
 * CSS1:  left | right | none
 * CSS2:  left | right | none | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  [[ left | right | inside | outside ] || [ top | bottom ] || next ] ] | none | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Float = base.baseConstructor();

util.extend(Float.prototype, base.base, {
	name: "float"
});

exports.parse = function (unparsedReal, bucket, container) {
	var f = new Float(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	f.debug('parse', unparsed);
	var lrio = false;
	var tb = false;
	var n = false;
	var ni = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent([ 'left', 'right' ])) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent([ 'inside', 'outside' ])) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent([ 'top', 'bottom' ])) {
			if (ni || tb) {
				return null;
			}

			tb = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('next')) {
			if (ni || n) {
				return null;
			}

			n = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('none')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('inherit')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(unparsed.advance());
			validate.call(f, 'minimumCss', f.firstToken(), 2);
			validate.call(f, 'browserQuirk', f.firstToken(), 'ie8');  // !DOCTYPE
			validate.call(f, 'browserUnsupported', f.firstToken(), 'ie7');  // !DOCTYPE
		} else {
			keepParsing = false;
		}
	}

	if (! f.list.length) {
		// No tokens parsed
		return null;
	}

	if (css3) {
		validate.call(f, 'minimumCss', f.firstToken(), 3);
	}

	f.debug('parse success', unparsed);
	f.unparsed = unparsed;
	return f;
};
