/* <display>
 *
 * In CSS1 - CSS2.1, it is just <display-type>
 * In CSS3 it is <display-type>? && <template>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Display = base.baseConstructor();

util.extend(Display.prototype, base.base, {
	name: "display"
});


exports.parse = function (unparsedReal, bucket, container) {
	var display = new Display(bucket, container, unparsedReal);
	var displayTypeCount = 0;
	var unparsed = display.unparsed;
	display.debug('parse', unparsedReal);

	if (display.handleInherit()) {
		return display;
	}

	var result = bucket['display-type'].parse(unparsed, bucket, display);

	if (result) {
		displayTypeCount ++;
		display.add(result);
		unparsed = result.unparsed;
	}

	result = bucket['template'].parse(unparsed, bucket, display);
	
	if (result) {
		validate.call(display, 'minimumCss', display.firstToken(), 3);
		display.add(result);
		unparsed = result.unparsed;

		if (! displayTypeCount) {
			result = bucket['display-type'].parse(unparsed, bucket, display);
			
			if (result) {
				display.add(result);
				unparsed = result.unparsed;
			}
		}
	} else if (! displayTypeCount) {
		display.debug('parse fail');
		return null;
	}

	display.debug('parse success', unparsed);
	display.unparsed = unparsed;
	return display;
};
