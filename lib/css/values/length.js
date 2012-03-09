/* <length>
 *
 * Lengths can be 0 (without a unit identifier) or a UNIT token that represents
 * either an absolute or relative length.
 */

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Length = base.baseConstructor();

util.extend(Length.prototype, base.base, {
	name: "length",

	allowed: [
		{
			validation: [],
			values: [ 
				"0",
				base.makeRegexp('[-+]?{n}(em|ex)'),
			]
		},
		{
			validation: [
				validate.suggestUsingRelativeUnits()
			],
			values: [ 
				// px were made an absolute length as of CSS2.1
				base.makeRegexp('[-+]?{n}(in|cm|mm|pt|pc|px)'),
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				base.makeRegexp('[-+]?{n}(ch|rem|vw|vh|vm)'),
			]
		}
	]
});

exports.parse = base.simpleParser(Length);
