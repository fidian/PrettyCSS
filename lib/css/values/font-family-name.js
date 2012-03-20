/* <font-family-name>
 *
 * Any single font name
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var FontFamilyName = base.baseConstructor();

util.extend(FontFamilyName.prototype, base.base, {
	name: "font-family-name"
});


exports.parse = function (unparsed, parser, container) {
	// Font family names can be either a quoted string (used verbatim)
	// or at least one token.  If it is not quoted, all whitespace at
	// the beginning and end are removed and whitespace between tokens
	// is changed into single spaces.
	var ffn = new FontFamilyName(parser, container, unparsed);
	ffn.debug('parse', unparsed);

	if (! ffn.unparsed.firstToken()) {
		return null;
	}

	if (ffn.unparsed.isType('STRING')) {
		ffn.add(unparsed.advance());
		return ffn;
	}

	if (! ffn.unparsed.isType('IDENT')) {
		return null;
	}

	// CSS3 spec clears up that a font name must be either a string
	// or a series of identifiers
	while (ffn.unparsed.isType('IDENT')) {
		ffn.add(unparsed.advance());
	}

	return ffn;
};
