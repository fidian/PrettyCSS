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
	// or at least one IDENT token.  If it is not quoted, all whitespace at
	// the beginning and end are removed and whitespace between tokens
	// is changed into single spaces.
	//
	// My interpretation of the spec is that if it is a single IDENT token
	// of "inherit", then that's not a family name.  Otherwise, two IDENT
	// tokens of "inherit monospace" or "monospace inherit" would be
	// parsed as a font name.  Since the single-token "inherit" scenario
	// should be handled by a higher-up value, and since any "inherit" found
	// could cause issues, I add a warning.
	var ffn = new FontFamilyName(bucket, container, unparsed);
	ffn.debug('parse', unparsed);
	ffn.preserveCase = true;

	if (ffn.unparsed.isType('STRING')) {
		ffn.add(ffn.unparsed.advance());
		ffn.debug('parse success - string');
		return ffn;
	}

	if (! ffn.unparsed.isType('IDENT')) {
		ffn.debug('parse fail - not ident');
		return null;
	}

	// CSS3 spec clears up that a font name must be either a string
	// or a series of identifiers
	while (ffn.unparsed.isType('IDENT')) {
		var token = ffn.unparsed.advance();
		ffn.add(token);
	}

	if (ffn.isInherit()) {
		ffn.addWarning('add-quotes', ffn.firstToken());
	}

	ffn.debug('parse success - ident');
	return ffn;
};
