/* <text-decoration-css2>
 *
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss2 = base.baseConstructor();

util.extend(TextDecorationCss2.prototype, base.base, {
	name: "text-decoration-css2"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdc2 = new TextDecorationCss2(bucket, container, unparsedReal);
	var unparsed = tdc2.unparsed.clone();
	tdc2.debug('parse', unparsedReal);

	if (tdc2.handleInherit(function (obj) {
		validate.call(obj, 'minimumCss', obj.firstToken(), 2);
		validate.call(obj, 'browserUnsupported', obj.firstToken(), 'ie7');
		validate.call(obj, 'browserQuirk', obj.firstToken(), 'ie8'); // !DOCTYPE needed
	})) {
		return tdc2;
	}

	if (unparsed.isContent('none')) {
		// none
		tdc2.add(unparsed.advance());
		tdc2.unparsed = unparsed;
	} else {
		// underline || overline || line-through || blink
		var hits = unparsed.matchAnyOrder([ 
			'underline', 
			'overline',
			'line-through',
			bucket['text-decoration-blink']	
		], tdc2);
		if (! hits) {
			tdc2.debug('parse fail - matched nothing');
			return null;
		}
	}

	return tdc2;
};
