/* float
 *
 * CSS1:  left | right | none
 * CSS2:  left | right | none | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  [[ left | right | inside | outside ] || [ top | bottom ] || next ] ] | none | inherit
 */
var base = require('./value-base');
var util = require('../../util');
var validate = require('./value-validate');

var Float = base.baseConstructor();

util.extend(Float.prototype, base.base, {
	name: "float",
});

exports.parse = function (tokensReal, parser, container) {
	var f = new Float(parser, container);
	var tokens = tokensReal.clone();
	f.debug('parse', tokens);
	var lrio = false;
	var tb = false;
	var n = false;
	var ni = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (tokens.isContent('left') || tokens.isContent('right')) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			f.add(tokens.advance());
		} else if (tokens.isContent('inside') || tokens.isContent('outside')) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			css3 = true;
			f.add(tokens.advance());
		} else if (tokens.isContent('top') || tokens.isContent('bottom')) {
			if (ni || tb) {
				return null;
			}

			tb = true;
			css3 = true;
			f.add(tokens.advance());
		} else if (tokens.isContent('next')) {
			if (ni || n) {
				return null;
			}

			n = true;
			css3 = true;
			f.add(tokens.advance());
		} else if (tokens.isContent('none')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(tokens.advance());
		} else if (tokens.isContent('inherit')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(tokens.advance());
			(validate.browserQuirk())('IE8'); // !DOCTYPE
			(validate.browserUnsupported())('IE7');
		} else {
			keepParsing = false;
		}
	}

	if (! f.list.length) {
		// No tokens
		return null;
	}

	if (css3) {
		(validate.minimumCss())(3);
	}

	f.debug('parse success', tokens);

	return {
		tokens: tokens,
		value: f
	};
};
