/* <display>
 *
 * In CSS1 - CSS2.1, it is just <display-type>
 * In CSS3 it is <display-type>? && <template>
 */

var base = require('./value-base');
var displayType = require('./display-type');
var template = require('./template');
var util = require('../../util');
var validate = require('./value-validate');

var Display = base.baseConstructor();

util.extend(Display.prototype, base.base, {
	name: "display",
});


exports.parse = function (tokensReal, parser, container) {
	var display = new Display(parser, container);
	var displayTypeCount = 0;
	var templateCount = 0;
	var result = true;
	var tokens = tokensReal.clone();
	display.debug('parse', tokens);

	while (tokens.length() && result) {
		var result = displayType.parse(tokens, parser, display);

		if (result) {
			displayTypeCount ++;
			
			if (parser.options.cssLevel < 3 && displayTypeCount > 1) {
				display.addWarning('display_multiple_types_css3', result.value.getFirstToken());
			}
		} else {
			result = template.parse(tokens, parser, display);

			if (result) {
				templateCount ++;

				if (parser.options.cssLevel < 3) {
					display.addWarning('display_template_css3', result.value.getFirstToken());
				}
			}
		}

		if (result) {
			display.add(result.value);
			tokens = result.tokens;
		}
	}

	if (displayTypeCount == 0 && templateCount == 0) {
		display.debug('parse fail');
		return null;
	}

	display.debug('parse success', tokens);
	return {
		tokens: tokens,
		value: display
	}
};
