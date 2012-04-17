/* text-align
 *
 * CSS1:  left | right | center | justify
 * CSS2:  <string> | inherit
 * CSS2.1:  Removed <string>
 * CSS3:  [ [ start | end | left | right | center ] || <string> ] | justify | match-parent | start end | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextAlign = base.baseConstructor();

util.extend(TextAlign.prototype, base.base, {
	name: "text-align"
});

exports.parse = function (unparsedReal, bucket, container) {
	var textalign = new TextAlign(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	textalign.debug('parse', unparsed);
	var selrc = false;
	var s = false;
	var jmsi = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent([ 'left', 'right', 'center' ])) {
			if (jmsi || selrc) {
				return null;
			}

			selrc = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isContent([ 'justify', 'inherit' ])) {
			if (jmsi || s || selrc) {
				return null;
			}

			jmsi = true;
			validate.call(textalign, 'minimumCss', textalign.firstToken(), 2);
			textalign.add(unparsed.advance());
		} else if (unparsed.isType('STRING')) {
			if (jmsi || s) {
				return null;
			}

			var token = unparsed.advance();

			if (token.content.length != 1) {
				textalign.addWarning('text-align-invalid-string', token);
			}

			css3 = true;  // Yes, this could be CSS2, but not CSS2.1
			s = true;
			textalign.add(token);
		} else if (unparsed.isContent('match-parent')) {
			if (jmsi || selrc || s) {
				return null;
			}

			jmsi = true;
			css3 = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isContent('start')) {
			if (jmsi || selrc) {
				return null;
			}

			css3 = true;
			textalign.add(unparsed.advance());

			if (unparsed.isContent('end')) {
				textalign.add(unparsed.advance());
				jmsi = true;
			} else {
				selrc = true;
			}
		} else if (unparsed.isContent('end')) {
			if (jmsi || selrc) {
				return null;
			}

			selrc = true;
			css3 = true;
			textalign.add(unparsed.advance());
		} else {
			keepParsing = false;
		}
	}

	if (! textalign.list.length) {
		// No tokens parsed
		return null;
	}

	if (css3) {
		validate.call(textalign, 'minimumCss', textalign.firstToken(), 3);
	}

	textalign.debug('parse success', unparsed);
	textalign.unparsed = unparsed;
	return textalign;
};
