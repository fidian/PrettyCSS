/* <font-family-generic-name>
 *
 * Special keyword-based generic font families.  Since these are keywords, you can not quote them.
 *
 * CSS2:  serif | sans-serif | cursive | fantasy | monospace
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFamilyGenericName = base.baseConstructor();

util.extend(FontFamilyGenericName.prototype, base.base, {
	name: "font-family-generic-name",

	allowed: [
		{
			validation: [],
			values: [
				"serif",
				"sans-serif",
				"cursive",
				"fantasy",
				"monospace"
			]
		},
		{
			validation: [
				validate.shouldNotBeQuoted()
			],
			values: [
				"'serif'",
				"'sans-serif'",
				"'cursive'",
				"'fantasy'",
				"'monospace'",
				'"serif"',
				'"sans-serif"',
				'"cursive"',
				'"fantasy"',
				'"monospace"'
			]
		},
		{
			validation: [
				validate.reserved()
			],
			values: [
				"initial",
				"default"
			]
		}
	]
});

exports.parse = base.simpleParser(FontFamilyGenericName);
