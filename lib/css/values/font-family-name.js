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


exports.parse = function (unparsed, bucket, container) {
	// Font family names can be either a quoted string (used verbatim)
	// or at least one token.  If it is not quoted, all whitespace at
	// the beginning and end are removed and whitespace between tokens
	// is changed into single spaces.
	var ffn = new FontFamilyName(bucket, container, unparsed);
	ffn.debug('parse', unparsed);

	if (ffn.unparsed.isType('STRING')) {
		ffn.add(ffn.unparsed.advance());
		ffn.debug('parse success - string');
		return ffn;
	}

	if (! ffn.unparsed.isType('IDENT')) {
		ffn.debug('parse fail');
		return null;
	}

	// CSS3 spec clears up that a font name must be either a string
	// or a series of identifiers
	while (ffn.unparsed.isType('IDENT')) {
		ffn.add(ffn.unparsed.advance());
	}

	ffn.debug('parse success - ident');
	return ffn;
};
