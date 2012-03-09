/* <display>
 *
 * In CSS1 - CSS2.1, it is just <display-type>
 * In CSS3 it is <display-type>? && <template>
 */

var base = require('./base');
var displayType = require('./display-type');
var template = require('./template');
var util = require('../../util');
var validate = require('./validate');

var Display = base.baseConstructor();

util.extend(Display.prototype, base.base, {
	name: "display",
});


exports.parse = function (unparsedReal, parser, container) {
	var display = new Display(parser, container, unparsedReal);
	var displayTypeCount = 0;
	var templateCount = 0;
	var result = true;
	var unparsed = display.unparsed.clone();

	while (unparsed.length() && result) {
		var result = displayType.parse(unparsed, parser, display);

		if (result) {
			displayTypeCount ++;
			
			if (parser.options.cssLevel < 3 && displayTypeCount > 1) {
				display.addWarning('display_multiple_types_css3', result.firstToken());
			}
		} else {
			result = template.parse(unparsed, parser, display);

			if (result) {
				templateCount ++;

				if (parser.options.cssLevel < 3) {
					display.addWarning('display_template_css3', result.firstToken());
				}
			}
		}

		if (result) {
			display.add(result);
			unparsed = result.unparsed.clone();
		}
	}

	if (displayTypeCount == 0 && templateCount == 0) {
		display.debug('parse fail');
		return null;
	}

	display.debug('parse success', unparsed);

	return display;
};
