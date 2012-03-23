/* <text-decoration>
 *
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var textDecorationBlink = require('./text-decoration-blink');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss2 = base.baseConstructor();

util.extend(TextDecorationCss2.prototype, base.base, {
	name: "text-decoration-css2"
});

exports.parse = function (unparsedReal, parser, container) {
	var tdc2 = new TextDecorationCss2(parser, container, unparsedReal);
	var unparsed = tdc2.unparsed.clone();
	tdc2.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		tdc2.add(unparsed.advance());
		tdc2.unparsed = unparsed;
		validate.call(tdc2, 'minimumCss', 2);
		validate.call(tdc2, 'browserUnsupported', 'IE7');
		validate.call(tdc2, 'browserQuirk', 'IE8'); // !DOCTYPE needed
		return tdc2;
	}

	if (unparsed.isContent('none')) {
		// none
		tdc2.add(unparsed.advance());
		tdc2.unparsed = unparsed;
	} else {
		// underline || overline || line-through || blink
		var result = unparsed.matchAnyOrder([ 'underline', 'overline', 'line-through', textDecorationBlink ], tdc2);
		
		if (! result.matches.length) {
			tdc2.debug('parse fail - matched nothing');
			return null;
		}

		result.matches.forEach(function (token) {
			tdc2.add(token);
		});
		tdc2.unparsed = unparsed;
	}

	// Could match the rule, but if there are any tokens left then assume
	// it is CSS3
	if (unparsed.length()) {
		tdc2.debug('parse fail - additional tokens found');
		return null;
	}

	return tdc2;
};
