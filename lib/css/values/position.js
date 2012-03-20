/* <position>
 *
 * CSS2: static | relative | absolute | fixed | inherit
 * CSS3: center | page | same | "<letter>"
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Position = base.baseConstructor();

util.extend(Position.prototype, base.base, {
	name: "position",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"static",
				"relative",
				"absolute",
				"fixed",
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"center",
				"page",
				"same",

				// Should be matching on something better.  CSS3 spec says
				// any single letter, digit, or Unicode character category
				// of Lu, Ll, Lt or Nd
				base.makeRegexp('"\\S"'),
				base.makeRegexp("'\\S'")
			]
		}
	]
});

exports.parse = base.simpleParser(Position);
